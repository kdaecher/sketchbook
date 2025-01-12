#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359
#define TWO_PI 6.28318530718


float plot(vec2 st, float pct){
  return smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

// following two rainbow functions are from https://www.shadertoy.com/view/lsfBWs
vec3 rainbow(float level){
	/*
		Target colors
		=============
		
		L  x   color
		0  0.0 vec4(1.0, 0.0, 0.0, 1.0);
		1  0.2 vec4(1.0, 0.5, 0.0, 1.0);
		2  0.4 vec4(1.0, 1.0, 0.0, 1.0);
		3  0.6 vec4(0.0, 0.5, 0.0, 1.0);
		4  0.8 vec4(0.0, 0.0, 1.0, 1.0);
		5  1.0 vec4(0.5, 0.0, 0.5, 1.0);
	*/
	
	float r = float(level <= 2.0) + float(level > 4.0) * 0.5;
	float g = max(1.0 - abs(level - 2.0) * 0.5, 0.0);
	float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);
	return vec3(r, g, b);
}

vec3 smoothRainbow (float x) {
  float level1 = floor(x*6.0);
  float level2 = min(6.0, floor(x*6.0) + 1.0);
  
  vec3 a = rainbow(level1);
  vec3 b = rainbow(level2);
  
  return mix(a, b, fract(x*6.0));
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  // Remap the space to -1. to 1.
  st = st *2.-1.; 
  
  vec2 center = vec2(0.5);

  float radius = 0.9;
  float dist = distance(st, center);
  vec3 circle = vec3(1.0 - smoothstep(0.0, radius, dist));
  vec3 color = smoothRainbow(dist*1.0/radius);

  vec2 center2 = vec2(0.0);
  float radius2 = 0.8;
  float dist2 = distance(st, center2);
  vec3 circle2 = vec3(1.0 - smoothstep(0.0, radius2, dist2));
  vec3 color2 = smoothRainbow(dist2*1.0/radius2);

  vec2 center3 = vec2(-0.7, .8);
  float radius3 = 1.;
  float dist3 = distance(st, center3);
  vec3 circle3 = vec3(1.0 - smoothstep(0.0, radius3, dist3));
  vec3 color3 = smoothRainbow(dist3*1.0/radius3);


  vec2 center4 = vec2(-.2, -.5);
  float radius4 = .8;
  float dist4 = distance(st, center4);
  vec3 circle4 = vec3(1.0 - smoothstep(0.0, radius4, dist4));
  vec3 color4 = smoothRainbow(dist4*1.0/radius4);

  vec2 center5 = vec2(0.7, -.5);
  float radius5 = .8;
  float dist5 = distance(st, center5);
  vec3 circle5 = vec3(1.0 - smoothstep(0.0, radius5, dist5));
  vec3 color5 = smoothRainbow(dist5*1.0/radius5);


  vec2 center6 = vec2(-.8, -.2);
  float radius6 = .8;
  float dist6 = distance(st, center6);
  vec3 circle6 = vec3(1.0 - smoothstep(0.0, radius6, dist6));
  vec3 color6 = smoothRainbow(dist6*1.0/radius6);

  vec2 center7 = vec2(-.8, -.8);
  float radius7 = .5;
  float dist7 = distance(st, center7);
  vec3 circle7 = vec3(1.0 - smoothstep(0.0, radius7, dist7));
  vec3 color7 = smoothRainbow(dist7*1.0/radius7);

  gl_FragColor = vec4(color * circle + color2 * circle2 + color3 * circle3 + color4 * circle4 + color5 * circle5 + color6 * circle6 + color7 * circle7, 1.0);
} 

