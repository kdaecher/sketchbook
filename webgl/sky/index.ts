export {};

import { loadShader, createShader, createProgram } from '../utils';

const CANVAS_SIZE = 600;

async function main() {
  const gl = canvas.getContext('webgl');
    if (!gl) {
    console.error("Failed to get WebGL context");
    return;
  }
    
  let vertexShaderSource = await loadShader('shaders/vertex.vert');
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

    
    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      console.error("Failed to create program");
      return;
    }

    // Get attribute and uniform locations
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    
    // Create buffer for positions
    const positionBuffer = gl.createBuffer();
    
    // Generate grid of points with finer granularity (step 1 instead of 2)
    // const positions = [];
    // for (let x = 0; x < CANVAS_SIZE; x += 1) {
    //     for (let y = 0; y < CANVAS_SIZE; y += 1) {
    //         positions.push(x, y);
    //     }
    // }
    const positions = [
    // First triangle (bottom-left, bottom-right, top-right)
    -1.0, -1.0,
    1.0, -1.0,
    1.0,  1.0,
    
    // Second triangle (bottom-left, top-right, top-left)
    -1.0, -1.0,
    1.0,  1.0,
    -1.0,  1.0
  ];
    
    // Upload position data
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Clear the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Use our shader program
    gl.useProgram(program);
    
    // Set the resolution
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    
    // Enable the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    
    // Bind the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // Tell the attribute how to get data out of positionBuffer
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

const body = document.getElementsByTagName("body")[0];
const content = document.getElementById("content") as HTMLElement;
const canvas = document.createElement("canvas");
body.style.height = "100vh";
content.style.display = "flex";
content.style.justifyContent = "center";
content.style.height = "100%";
content.appendChild(canvas);
canvas.id = "webgl-canvas";
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;


main();
