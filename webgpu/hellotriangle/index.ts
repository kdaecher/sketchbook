async function draw() {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter?.requestDevice();
}

draw();
