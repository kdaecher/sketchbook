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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
function loadShader(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        return yield response.text();
    });
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const gl = canvas.getContext("webgl");
        if (!gl) {
            console.error("Failed to get WebGL context");
            return;
        }
        const vertexShaderSource = yield loadShader('shaders/vertex.vert');
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        if (!vertexShader) {
            console.error("Failed to create vertex shader");
            return;
        }
        const fragmentShaderSource = yield loadShader('shaders/fragment.frag');
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
    });
}
const canvas = document.createElement("canvas");
(_a = document.getElementById("content")) === null || _a === void 0 ? void 0 : _a.appendChild(canvas);
canvas.id = "webgl-canvas";
canvas.width = 300;
canvas.height = 300;
const canvasRect = canvas.getBoundingClientRect();
let mousePos = [0, 0];
canvas.addEventListener("mousemove", (event) => {
    const x = (event.clientX - canvasRect.left) / canvasRect.width;
    const y = 1.0 - (event.clientY - canvasRect.top) / canvasRect.height; // Flip Y
    mousePos = [x, y];
});
main();
