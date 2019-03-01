#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;

in vec2 fs_Pos;
out vec4 out_Col;

vec3 seed = vec3(0.1, 0.05, 0.49);

float power(float x, int y) {
  float ret = 1.0;
  for (int i = y; i > 0; i--) {
    ret *= x;
  }
  return ret;
}

float random1( vec2 p , vec2 seed) {
  return fract(sin(dot(p + seed, vec2(127.1, 311.7))) * 43758.5453);
}

float interpNoise2D(float x, float y) {
  float intX = floor(x);
  float fractX = fract(x);
  float intY = floor(y);
  float fractY = fract(y);

  float v1 = random1(vec2(intX, intY), seed.xy);
  float v2 = random1(vec2(intX + 1.0, intY), seed.xy);
  float v3 = random1(vec2(intX, intY + 1.0), seed.xy);
  float v4 = random1(vec2(intX + 1.0, intY + 1.0), seed.xy);

  float i1 = mix(v1, v2, fractX);
  float i2 = mix(v3, v4, fractX);
  return mix(i1, i2, fractY);
}

float fbm(float x, float y, float octaves) {
  float total = 0.0;
  float persistence = 0.5;

  for(int i = 0; i < int(ceil(octaves)); i++) {
    float freq = power(2.0, i);
    float amp = power(persistence, i);
    total += interpNoise2D(x * freq, y * freq) * amp;
  }
  return total;
}

void main() {
	out_Col = vec4(0.15, 0.8 * fbm(abs(fs_Pos.x), abs(fs_Pos.y), 6.0), 0.8 * fbm(abs(fs_Pos.x), abs(fs_Pos.y), 8.0), 1.0);
}
