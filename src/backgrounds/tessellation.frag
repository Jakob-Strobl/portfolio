#version 300 es

precision highp float;

const float SQRT_THREE = 1.7320508;
const float TAU = 6.2831853;
const vec3 BACKGROUND_COLOR = vec3(0.0745, 0.051, 0.1255);

uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec2 uSeed;
uniform float uTime;
uniform float uIntensity;

out vec4 outColor;

float hashCell(vec3 cell) {
    vec3 seededCell = cell + vec3(uSeed * 137.19, uSeed.x * 71.73 + uSeed.y * 43.11);
    return fract(sin(dot(seededCell, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float aspectRatio = uResolution.x / uResolution.y;
    vec2 position = uv - 0.5;
    position.x *= aspectRatio;

    float gridScale = mix(11.0, 15.0, clamp(uIntensity - 0.5, 0.0, 0.85) / 0.85);
    vec2 gridPosition = position * gridScale;
    float latticeY = gridPosition.y * (2.0 / SQRT_THREE);
    float latticeX = gridPosition.x - latticeY * 0.5;
    vec2 lattice = vec2(latticeX, latticeY);
    vec2 cell = floor(lattice);
    vec2 local = fract(lattice);
    bool isUpperTriangle = local.x + local.y > 1.0;

    vec3 barycentric;
    if (isUpperTriangle) {
        barycentric = vec3(1.0 - local.x, 1.0 - local.y, local.x + local.y - 1.0);
    } else {
        barycentric = vec3(local.x, local.y, 1.0 - local.x - local.y);
    }

    vec3 triangleId = vec3(cell, isUpperTriangle ? 1.0 : 0.0);
    float variation = hashCell(triangleId);
    float secondaryVariation = hashCell(triangleId + vec3(19.0, 7.0, 3.0));
    float ambientLife = 0.5 + 0.5 * sin(uTime * mix(0.19, 0.32, secondaryVariation) + variation * TAU);

    vec2 pointer = uPointer - 0.5;
    pointer.x *= aspectRatio;
    float pointerDistance = distance(position, pointer);
    float pointerRadius = mix(0.32, 0.5, clamp(uIntensity - 0.5, 0.0, 0.85) / 0.85);
    float pointerInfluence = smoothstep(pointerRadius, 0.0, pointerDistance);
    float pointerRipple = sin(pointerDistance * 30.0 - uTime * 1.15) * pointerInfluence;

    float hue = position.x * 0.075 + position.y * 0.045 + variation * 0.1 + uTime * 0.012
        + pointerInfluence * 0.12 + pointerRipple * 0.025;
    vec3 rainbow = 0.54 + 0.46 * cos(TAU * (hue + vec3(0.0, 0.33, 0.67)));
    float colorStrength = 0.22 + uIntensity * 0.1 + pointerInfluence * uIntensity * 0.2;
    float luminance = 0.72 + variation * 0.11 + ambientLife * 0.1 + pointerInfluence * 0.08;
    vec3 color = mix(BACKGROUND_COLOR * 0.78, rainbow * 0.62, colorStrength) * luminance;

    float closestEdge = min(barycentric.x, min(barycentric.y, barycentric.z));
    float edgeWidth = max(fwidth(closestEdge), 0.0001);
    float edge = 1.0 - smoothstep(edgeWidth * 0.45, edgeWidth * 1.6, closestEdge);
    vec3 edgeColor = mix(BACKGROUND_COLOR * 0.62, rainbow * 0.28, 0.24 + pointerInfluence * 0.18);

    outColor = vec4(mix(color, edgeColor, edge * 0.72), 1.0);
}
