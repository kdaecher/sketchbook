#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec4 circleEfficient(in vec2 _st, in vec2 _center, in float _radius, in vec3 _color){
  vec2 dist = _st-_center;
	float pct = 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
  return vec4(pct * _color, 1.0);
}

vec4 circle(vec2 st, vec2 center, float radius, vec3 color) {
  float multiplier = 1.0/radius;
  float pct = 1.0 - step(1.0, multiplier*distance(st,center));
	return vec4(pct * color, 1.0);
}

vec4 diffuseCircle(vec2 st, vec2 center, float radius, vec3 color) {
  float multiplier = 1.0/radius;
  float pct = 1.0 - multiplier*distance(st,center);
  return vec4(pct * color, 1.0);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

  float pt = cos(u_time);
  float pt2 = sin(u_time);
  

  float pct = min(distance(st,vec2(0.4 + pt)),distance(st,vec2(0.6 - pt2)));

  vec3 color = vec3(0.0, 1.0, 0.97);
  vec3 color2 = vec3(1.0, 0.0, 0.8);
  vec3 color3 = vec3(0.15, 1.0, 0.0);
  vec3 color4 = vec3(1.0, 0.0, 0.0);

  // vec4 circle = min(
  //   diffuseCircle(st, vec2(0.4), 0.1, color), 
  //   diffuseCircle(st, vec2(0.6), 0.1, color2)
  // );

  vec4 circleComp1 = max(
    diffuseCircle(st, vec2( abs(pt2),  abs(pt)), 0.1, color), 
    diffuseCircle(st, vec2(abs(pt), abs(pt2)), 0.3, color2)
  );

  vec4 circleComp2 = max(
    circleEfficient(st, vec2(abs(pt2)), 0.1, color3), 
    diffuseCircle(st, vec2(abs(pt)), 0.1, color4)
  );

	gl_FragColor = circleComp1 + circleComp2;
}

