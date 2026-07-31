#version 300 es

precision highp float;

const float TAU = 6.2831853;
const vec3 BACKGROUND_COLOR = vec3(0.0745, 0.051, 0.1255);

uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uIntensity;
uniform float uOpacity;
uniform bool uPointPass;

in vec2 vPosition;
in vec2 vColor;
in vec3 vBarycentric;
in float vLife;

out vec4 outColor;

vec3 rainbow(float hue) {
    return 0.54 + 0.46 * cos(TAU * (hue + vec3(0.0, 0.33, 0.67)));
}

void main() {
    float aspectRatio = uResolution.x / uResolution.y;
    vec2 pointerDelta = vPosition - uPointer;
    pointerDelta.x *= aspectRatio;
    float pointerDistance = length(pointerDelta);
    float pointerInfluence = exp(-pointerDistance * pointerDistance * 7.5);
    float ripple = sin(pointerDistance * 28.0 - uTime * 1.65) * pointerInfluence;
    float hue = vColor.x + uTime * 0.004 + ripple * 0.025;
    vec3 accent = rainbow(hue);
    float brightness = vColor.y;
    float life = smoothstep(0.02, 0.95, vLife);

    if (uPointPass) {
        vec2 point = gl_PointCoord * 2.0 - 1.0;
        float radius = length(point);
        float circle = 1.0 - smoothstep(0.5, 1.0, radius);
        float halo = (1.0 - smoothstep(0.2, 1.0, radius)) * 0.22;
        float saturation = 0.5 + pointerInfluence * 0.38;
        vec3 pointColor = mix(BACKGROUND_COLOR * 1.15, accent, saturation) * (0.7 + brightness * 0.42);
        float alpha = (circle + halo) * life * uOpacity * (0.48 + uIntensity * 0.22);
        if (alpha < 0.01) discard;
        outColor = vec4(pointColor, alpha);
        return;
    }

    float closestEdge = min(vBarycentric.x, min(vBarycentric.y, vBarycentric.z));
    float edgeDerivative = max(fwidth(closestEdge), 0.0001);
    float edge = 1.0 - smoothstep(edgeDerivative * 0.45, edgeDerivative * 1.55, closestEdge);
    float edgeStrength = (0.34 + uIntensity * 0.2 + pointerInfluence * 0.3) * life;
    vec3 fill = BACKGROUND_COLOR * (0.92 + brightness * 0.035);
    fill += (accent - BACKGROUND_COLOR) * (0.012 + pointerInfluence * 0.008) * life;
    vec3 edgeColor = mix(BACKGROUND_COLOR * 1.08, accent, 0.46 + pointerInfluence * 0.34);
    edgeColor *= 0.64 + brightness * 0.28;
    vec3 color = mix(fill, edgeColor, edge * edgeStrength);

    outColor = vec4(color, uOpacity * mix(0.72, 1.0, life));
}
