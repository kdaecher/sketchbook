async function draw() {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter?.requestDevice();

  if (!device) {
    console.error("GPU device not provisioned");
    return;
  }

  const canvas = document.getElementById("webgpu-canvas") as HTMLCanvasElement;
  const context = canvas.getContext("webgpu");

  if (!context) {
    console.error("WebGPU context not found");
    return;
  }

  context.configure({
    device,
    format: "bgra8unorm"
  });

  const vertexData = new Float32Array([
    0,1,1,
    -1,-1,1,
    1,-1,1
  ]);

  const vertexBuffer = device.createBuffer({
    size: vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  });

  device.queue.writeBuffer(vertexBuffer, 0, vertexData);

  const shaderModule = device.createShaderModule({
    code: `
      @vertex
      fn vertMain(@location(0) pos : vec3f) -> 
          @builtin(position) vec4f {
        return vec4f(pos, 1);
      }
      @fragment
      fn fragMain() -> @location(0) vec4f {
        return vec4f(1, 0, 0, 1);
      }
    `
  });

  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vertMain",
      buffers: [{
        arrayStride: 12,
        attributes: [{
          shaderLocation: 0,
          offset: 0,
          format: "float32x3"
        }],
      }],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fragMain",
      targets: [{ format: "bgra8unorm" }]
    },
  });

  const commandEncoder = device.createCommandEncoder();

  const passEncoder = commandEncoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      loadOp: "clear",
      clearValue: [0.0, 0.0, 0.0, 1.0],
      storeOp: "store"
    }],
  });
  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, vertexBuffer);
  passEncoder.draw(3);
  passEncoder.end();

  const commandBuffer = commandEncoder.finish();

  device.queue.submit([commandBuffer])
}

function main() {
  const canvas = document.createElement("canvas");
  document.getElementById("content")?.appendChild(canvas);
  canvas.id = "webgpu-canvas";

  draw().then(() => console.log("Finished drawing"));
}

main();
