async function loadShader(url) {
    const response = await fetch(url);
    return await response.text();
}
async function draw() {
    const gl = canvas.getContext("webgl");
    if (!gl) {
        console.error("Failed to get WebGL context");
        return;
    }
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) {
        console.error("Failed to create vertex shader");
        return;
    }
    const vertexShaderSource = await loadShader('shaders/vertex.vert');
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Failed to compile vertex shader");
    }
    const fragmentShaderSource = await loadShader('shaders/fragment.frag');
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
        console.error("Failed to create fragment shader");
        return;
    }
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Failed to compile fragment shader");
    }
    const program = gl.createProgram();
    if (!program) {
        console.error("Failed to create program");
        return;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Failed to link program");
        return;
    }
    gl.useProgram(program);
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
const canvas = document.createElement("canvas");
document.getElementById("content")?.appendChild(canvas);
canvas.id = "webgl-canvas";
draw();
export {};
