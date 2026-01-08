async function loadShader(url) {
    const response = await fetch(url);
    return await response.text();
}
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) {
        console.error("Failed to create shader");
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
async function main() {
    const gl = canvas.getContext("webgl");
    if (!gl) {
        console.error("Failed to get WebGL context");
        return;
    }
    let vertexShaderSource = await loadShader('shaders/vertex.vert');
    // vertexShaderSource = await resolveLygiaAsync(vertexShaderSource);
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    if (!vertexShader) {
        console.error("Failed to create vertex shader");
        return;
    }
    let fragmentShaderSource = await loadShader('shaders/fragment.frag');
    // fragmentShaderSource = await resolveLygiaAsync(fragmentShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!fragmentShader) {
        console.error("Failed to create fragment shader");
        return;
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
        // First triangle (bottom-left, bottom-right, top-right)
        -1.0, -1.0,
        1.0, -1.0,
        1.0, 1.0,
        // Second triangle (bottom-left, top-right, top-left)
        -1.0, -1.0,
        1.0, 1.0,
        -1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    // uniform locations
    const timeUniformLocation = gl.getUniformLocation(program, "u_time");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");
    const colorUniformLocation = gl.getUniformLocation(program, "u_color");
    // Animation state
    let startTime = performance.now();
    let isRunning = true;
    function render(currentTime) {
        if (!gl) {
            console.error("couldn't get WebGL context at render time");
            return;
        }
        const time = (currentTime - startTime) * 0.001;
        // Clear canvas
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // Update uniforms
        gl.uniform1f(timeUniformLocation, time);
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(mouseUniformLocation, mousePos[0], mousePos[1]);
        const r = Math.sin(time) * 0.5 + 0.5;
        const g = Math.cos(time) * 0.5 + 0.5;
        gl.uniform4f(colorUniformLocation, r, g, 0.5, 1.0);
        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (isRunning) {
            requestAnimationFrame(render);
        }
    }
    requestAnimationFrame(render);
}
const body = document.getElementsByTagName("body")[0];
const content = document.getElementById("content");
const canvas = document.createElement("canvas");
body.style.background = "black";
body.style.height = "100vh";
content.style.display = "flex";
content.style.justifyContent = "center";
content.style.height = "100%";
content.appendChild(canvas);
canvas.id = "webgl-canvas";
canvas.width = 800;
canvas.height = 800;
const canvasRect = canvas.getBoundingClientRect();
let mousePos = [0, 0];
canvas.addEventListener("mousemove", (event) => {
    const x = (event.clientX - canvasRect.left) / canvasRect.width;
    const y = 1.0 - (event.clientY - canvasRect.top) / canvasRect.height; // Flip Y
    mousePos = [x, y];
});
main();
export {};
