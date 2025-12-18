"use strict";
class WatercolorSketchbook {
    constructor() {
        this.canvas = document.getElementById('watercolorCanvas');
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        if (!this.gl) {
            alert('WebGL not supported');
            return;
        }
        this.currentColor = [0.2, 0.4, 0.8, 1.0]; // Blue
        this.brushSettings = {
            size: 15,
            opacity: 0.3,
            wetness: 0.7,
            bleeding: 0.4
        };
        this.isDrawing = false;
        this.lastPos = null;
        this.brushPos = null;
        this.currentTool = 'brush';
        // Initialize WebGL objects
        this.vertexShader = null;
        this.fragmentShader = null;
        this.program = null;
        this.locations = {};
        this.positionBuffer = null;
        this.texCoordBuffer = null;
        this.canvasTexture = null;
        this.framebuffer = null;
        this.startTime = 0;
        this.initWebGL();
        this.setupEventListeners();
        this.setupUI();
        this.startRenderLoop();
    }
    initWebGL() {
        const gl = this.gl;
        // Vertex shader
        const vertexShaderSource = `
          attribute vec2 a_position;
          attribute vec2 a_texCoord;
          uniform vec2 u_resolution;
          varying vec2 v_texCoord;
          
          void main() {
              vec2 clipSpace = ((a_position / u_resolution) * 2.0) - 1.0;
              gl_Position = vec4(clipSpace, 0, 1);
              v_texCoord = a_texCoord;
          }
      `;
        // Fragment shader for watercolor effect
        const fragmentShaderSource = `
          precision mediump float;
          
          uniform sampler2D u_texture;
          uniform vec2 u_resolution;
          uniform vec4 u_color;
          uniform float u_opacity;
          uniform float u_wetness;
          uniform float u_bleeding;
          uniform vec2 u_brushPos;
          uniform float u_brushSize;
          uniform float u_time;
          uniform bool u_isDrawing;
          
          varying vec2 v_texCoord;
          
          float noise(vec2 co) {
              return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          float fbm(vec2 p) {
              float value = 0.0;
              float amplitude = 0.5;
              for(int i = 0; i < 4; i++) {
                  value += amplitude * noise(p);
                  p *= 2.0;
                  amplitude *= 0.5;
              }
              return value;
          }
          
          void main() {
              vec2 coord = gl_FragCoord.xy;
              vec4 currentColor = texture2D(u_texture, v_texCoord);
              
              if (u_isDrawing) {
                  float dist = distance(coord, u_brushPos);
                  float brushRadius = u_brushSize;
                  
                  if (dist < brushRadius) {
                      // Create watercolor effect
                      vec2 noiseCoord = coord * 0.01 + u_time * 0.001;
                      float noiseValue = fbm(noiseCoord);
                      
                      // Brush falloff with noise
                      float falloff = 1.0 - (dist / brushRadius);
                      falloff = pow(falloff, 2.0);
                      falloff *= (0.7 + 0.3 * noiseValue);
                      
                      // Watercolor bleeding effect
                      float bleedingEffect = u_bleeding * noiseValue * falloff;
                      
                      // Mix colors with watercolor characteristics
                      vec4 brushColor = u_color;
                      brushColor.a *= u_opacity * falloff;
                      
                      // Wet-on-wet blending
                      float wetBlend = u_wetness * (1.0 - currentColor.a);
                      brushColor.rgb = mix(brushColor.rgb, currentColor.rgb, wetBlend * 0.3);
                      
                      // Apply color bleeding
                      if (bleedingEffect > 0.5) {
                          brushColor.rgb = mix(brushColor.rgb, vec3(noiseValue), bleedingEffect * 0.2);
                      }
                      
                      // Alpha blending
                      float alpha = brushColor.a;
                      vec3 finalColor = mix(currentColor.rgb, brushColor.rgb, alpha);
                      float finalAlpha = max(currentColor.a, alpha);
                      
                      gl_FragColor = vec4(finalColor, finalAlpha);
                  } else {
                      gl_FragColor = currentColor;
                  }
              } else {
                  // When not drawing, just pass through the current texture unchanged
                  gl_FragColor = currentColor;
              }
          }
      `;
        // Create shaders
        this.vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
        this.fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!this.vertexShader || !this.fragmentShader) {
            throw new Error('Failed to create shaders');
        }
        this.program = this.createProgram(this.vertexShader, this.fragmentShader);
        if (!this.program) {
            throw new Error('Failed to create shader program');
        }
        // Get attribute and uniform locations
        this.locations = {
            position: gl.getAttribLocation(this.program, 'a_position'),
            texCoord: gl.getAttribLocation(this.program, 'a_texCoord'),
            resolution: gl.getUniformLocation(this.program, 'u_resolution'),
            color: gl.getUniformLocation(this.program, 'u_color'),
            opacity: gl.getUniformLocation(this.program, 'u_opacity'),
            wetness: gl.getUniformLocation(this.program, 'u_wetness'),
            bleeding: gl.getUniformLocation(this.program, 'u_bleeding'),
            brushPos: gl.getUniformLocation(this.program, 'u_brushPos'),
            brushSize: gl.getUniformLocation(this.program, 'u_brushSize'),
            time: gl.getUniformLocation(this.program, 'u_time'),
            isDrawing: gl.getUniformLocation(this.program, 'u_isDrawing')
        };
        // Create buffers
        this.positionBuffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();
        // Set up quad vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            this.canvas.width, 0,
            0, this.canvas.height,
            this.canvas.width, this.canvas.height
        ]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1
        ]), gl.STATIC_DRAW);
        // Create texture for canvas buffer
        this.canvasTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.canvasTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.canvas.width, this.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // Create framebuffer
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.canvasTexture, 0);
        // Set up viewport
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        // Clear canvas to white
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.startTime = Date.now();
    }
    createShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        if (!shader) {
            console.error('Failed to create shader');
            return null;
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    createProgram(vertexShader, fragmentShader) {
        const gl = this.gl;
        const program = gl.createProgram();
        if (!program) {
            console.error('Failed to create program');
            return null;
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }
    setupEventListeners() {
        const canvas = this.canvas;
        // Mouse events
        canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        canvas.addEventListener('mousemove', (e) => this.draw(e));
        canvas.addEventListener('mouseup', () => this.stopDrawing());
        canvas.addEventListener('mouseout', () => this.stopDrawing());
        // Touch events
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });
    }
    setupUI() {
        // Color palette
        const colors = [
            [0.8, 0.2, 0.2, 1.0], // Red
            [0.2, 0.4, 0.8, 1.0], // Blue
            [0.2, 0.6, 0.3, 1.0], // Green
            [0.9, 0.7, 0.1, 1.0], // Yellow
            [0.6, 0.3, 0.8, 1.0], // Purple
            [0.9, 0.4, 0.1, 1.0], // Orange
            [0.1, 0.1, 0.1, 1.0], // Black
            [0.5, 0.3, 0.2, 1.0], // Brown
            [0.8, 0.4, 0.6, 1.0], // Pink
            [0.3, 0.6, 0.6, 1.0], // Teal
            [0.7, 0.7, 0.1, 1.0], // Olive
            [0.4, 0.4, 0.4, 1.0] // Gray
        ];
        const palette = document.getElementById('colorPalette');
        colors.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            if (index === 1)
                swatch.classList.add('active'); // Blue default
            swatch.style.backgroundColor = `rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, ${color[3]})`;
            swatch.addEventListener('click', () => {
                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                this.currentColor = color;
            });
            palette.appendChild(swatch);
        });
        // Sliders
        const brushSizeSlider = document.getElementById('brushSize');
        const brushSizeValue = document.getElementById('brushSizeValue');
        brushSizeSlider.addEventListener('input', (e) => {
            const target = e.target;
            this.brushSettings.size = parseFloat(target.value);
            brushSizeValue.textContent = this.brushSettings.size + 'px';
        });
        const opacitySlider = document.getElementById('opacity');
        const opacityValue = document.getElementById('opacityValue');
        opacitySlider.addEventListener('input', (e) => {
            const target = e.target;
            this.brushSettings.opacity = parseFloat(target.value);
            opacityValue.textContent = Math.round(this.brushSettings.opacity * 100) + '%';
        });
        const wetnessSlider = document.getElementById('wetness');
        const wetnessValue = document.getElementById('wetnessValue');
        wetnessSlider.addEventListener('input', (e) => {
            const target = e.target;
            this.brushSettings.wetness = parseFloat(target.value);
            wetnessValue.textContent = Math.round(this.brushSettings.wetness * 100) + '%';
        });
        const bleedingSlider = document.getElementById('bleeding');
        const bleedingValue = document.getElementById('bleedingValue');
        bleedingSlider.addEventListener('input', (e) => {
            const target = e.target;
            this.brushSettings.bleeding = parseFloat(target.value);
            bleedingValue.textContent = Math.round(this.brushSettings.bleeding * 100) + '%';
        });
        // Tool buttons
        const brushTool = document.getElementById('brushTool');
        const spongeTool = document.getElementById('spongeTool');
        brushTool.addEventListener('click', (e) => {
            document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            this.currentTool = 'brush';
        });
        spongeTool.addEventListener('click', (e) => {
            document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            this.currentTool = 'sponge';
        });
        // Action buttons
        const clearButton = document.getElementById('clearCanvas');
        const saveButton = document.getElementById('saveCanvas');
        clearButton.addEventListener('click', () => {
            this.clearCanvas();
        });
        saveButton.addEventListener('click', () => {
            this.saveCanvas();
        });
    }
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    startDrawing(e) {
        this.isDrawing = true;
        this.lastPos = this.getMousePos(e);
    }
    draw(e) {
        if (!this.isDrawing)
            return;
        const pos = this.getMousePos(e);
        this.brushPos = pos;
        this.lastPos = pos;
    }
    stopDrawing() {
        this.isDrawing = false;
        this.lastPos = null;
    }
    render() {
        const gl = this.gl;
        const time = (Date.now() - this.startTime) / 1000.0;
        if (!this.program || !this.canvasTexture)
            return;
        gl.useProgram(this.program);
        // Set uniforms
        gl.uniform2f(this.locations.resolution, this.canvas.width, this.canvas.height);
        gl.uniform4f(this.locations.color, this.currentColor[0], this.currentColor[1], this.currentColor[2], this.currentColor[3]);
        gl.uniform1f(this.locations.opacity, this.brushSettings.opacity);
        gl.uniform1f(this.locations.wetness, this.brushSettings.wetness);
        gl.uniform1f(this.locations.bleeding, this.brushSettings.bleeding);
        gl.uniform1f(this.locations.brushSize, this.brushSettings.size);
        gl.uniform1f(this.locations.time, time);
        gl.uniform1i(this.locations.isDrawing, this.isDrawing ? 1 : 0);
        if (this.brushPos) {
            gl.uniform2f(this.locations.brushPos, this.brushPos.x, this.canvas.height - this.brushPos.y);
        }
        // Bind attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(this.locations.position);
        gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.enableVertexAttribArray(this.locations.texCoord);
        gl.vertexAttribPointer(this.locations.texCoord, 2, gl.FLOAT, false, 0, 0);
        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.canvasTexture);
        // Render to framebuffer first
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        // Update texture with the new content
        gl.bindTexture(gl.TEXTURE_2D, this.canvasTexture);
        gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, this.canvas.width, this.canvas.height, 0);
        // Display on screen
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    startRenderLoop() {
        const animate = () => {
            this.render();
            requestAnimationFrame(animate);
        };
        animate();
    }
    clearCanvas() {
        const gl = this.gl;
        if (!this.framebuffer)
            return;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    saveCanvas() {
        const link = document.createElement('a');
        link.download = 'watercolor-sketch.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}
// Initialize the watercolor sketchbook
window.addEventListener('load', () => {
    new WatercolorSketchbook();
});
