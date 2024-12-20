"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function draw() {
    return __awaiter(this, void 0, void 0, function* () {
        const adapter = yield navigator.gpu.requestAdapter();
        const device = yield (adapter === null || adapter === void 0 ? void 0 : adapter.requestDevice());
        if (!device) {
            console.error("GPU device not provisioned");
            return;
        }
        const canvas = document.getElementById("webgpu-canvas");
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
            0, 1, 1,
            -1, -1, 1,
            1, -1, 1
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
        device.queue.submit([commandBuffer]);
    });
}
function main() {
    var _a;
    const canvas = document.createElement("canvas");
    (_a = document.getElementById("content")) === null || _a === void 0 ? void 0 : _a.appendChild(canvas);
    canvas.id = "webgpu-canvas";
    draw().then(() => console.log("Finished drawing"));
}
main();
