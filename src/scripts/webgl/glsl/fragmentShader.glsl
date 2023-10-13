#define m4v3Vec(m4, v3) normalize((m4 * vec4(v3, 0.0)).xyz)
#define m4v3Coord(m4, v3) (m4 * vec4(v3, 1.0)).xyz

uniform vec3 uCameraPosition;
uniform mat4 uProjectionMatrixInverse;
uniform mat4 uViewMatrixInverse;
uniform mat4 uNormalMatrix;
uniform mat4 uModelMatrix;

varying vec2 vUv;

#include './raymarching/primitives.glsl'
#include './raymarching/combinations.glsl'

float sdf(vec3 p) {
  vec3 mp = m4v3Coord(uModelMatrix, p);
  float r = 0.02;
  float box = sdBox(mp, vec3(0.25 - r)) - r;
  float sp = sdSphere(mp, 0.3);
  float final = opSmoothSubtraction(sp, box, 0.05);
  return final;
}

#include './raymarching/normal.glsl'

void main() {
  vec3 ro = uCameraPosition;
  vec2 p = vUv * 2.0 - 1.0;
  vec4 ndcRay = vec4(p, 1.0, 1.0);
  vec4 target = uViewMatrixInverse * uProjectionMatrixInverse * ndcRay;
  vec3 ray = normalize(target.xyz / target.w - ro);

  float totalDist = 0.0;
  float totalMax = length(ro) * 2.0;

  for (int i = 0; i < 64; i++) {
    vec3 rayPos = ro + totalDist * ray;
    float dist = sdf(rayPos);
    if (abs(dist) < 0.001 || totalMax < totalDist) break;
    totalDist += dist;
  }

  vec4 color = vec4(0);

  if (totalDist < totalMax) {
    vec3 p = ro + totalDist * ray;
    vec3 normal = calcNormal(p);
    normal = m4v3Vec(uNormalMatrix, normal);
    color = vec4(normal, 1.0);
  }

  gl_FragColor = color;
}