export {}

const REFRESH_RATE_MILLIS = 30;
let animation: NodeJS.Timeout;
let analyser: AnalyserNode;
let frequencyData: Uint8Array;
let minDecibels: number;
let maxDecibels: number;
let audioCtx: AudioContext;



function draw(cb?: (loudness: number) => void) {
  analyser.getByteFrequencyData(frequencyData);
  // console.log(frequencyData);

  let totalLoudness = 0;
  let v;
    for (var i = 0; i < frequencyData.length; i++) {
        totalLoudness += frequencyData[i];
    }

    // console.log("totalLoudness", totalLoudness);

    let averageLoudness = totalLoudness / frequencyData.length / 255;
    console.log("averageLoudness", averageLoudness);
    let decibels = minDecibels + averageLoudness * Math.abs(minDecibels - maxDecibels);

    requestAnimationFrame(() => cb?.(averageLoudness * 10));
    // console.log(decibels);
}


async function main() {
  const neptuneSolo = new Audio("assets/neptun-solo-07.wav");

  const playButton = document.createElement("button");
  const body = document.getElementsByTagName("body")[0];
  body.appendChild(playButton);
  playButton.textContent = "Play";


  const webglDraw = await initWebGl();

  neptuneSolo.onplay = () => {
    animation = setInterval(() => {
      analyser.getByteTimeDomainData(frequencyData);

      // console.log(frequencyData);

      draw(webglDraw);
    }, REFRESH_RATE_MILLIS);
  };

  neptuneSolo.onpause = function() {
    clearInterval(animation);
  };

  neptuneSolo.onended = function() {
    clearInterval(animation);
    audioCtx.close();
    analyser.disconnect();
    neptuneSolo.pause();
  };


  playButton.addEventListener("click", () => { 
    audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;

  
    const audioSrc = audioCtx.createMediaElementSource(neptuneSolo);
    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);

    minDecibels = analyser.minDecibels;
    console.log("minDecibels", minDecibels);
    maxDecibels = analyser.maxDecibels;  
    console.log("maxDecibels", maxDecibels);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);

  
    neptuneSolo.play();
  });
}




// web gl

async function initWebGl() {
  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.error("Failed to get WebGL context");
    return;
  }

  const vertexShaderSource = await loadShader('shaders/vertex.vert');
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  if (!vertexShader) {
    console.error("Failed to create vertex shader");
    return;
  }

  const fragmentShaderSource = await loadShader('shaders/fragment.frag');
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
    1.0,  1.0,
    
    // Second triangle (bottom-left, top-right, top-left)
    -1.0, -1.0,
    1.0,  1.0,
    -1.0,  1.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);


  // uniform locations
  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  const soundUniformLocation = gl.getUniformLocation(program, "u_sound");


  function render(currentSound: number) {
    if (!gl) {
      console.error("couldn't get WebGL context at render time");
      return;
    }

    // Clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Update uniforms
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(soundUniformLocation, currentSound);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  return render;
}

async function loadShader(url: string) {
  const response = await fetch(url);
  return await response.text();
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
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


const canvas = document.createElement("canvas");
document.getElementById("content")?.appendChild(canvas);
canvas.id = "webgl-canvas";
canvas.width = 300;
canvas.height = 300;



//main
main();