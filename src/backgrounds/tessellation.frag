#version 300 es

precision highp float;
precision highp int;

const float TAU = 6.2831853;
const vec3 BACKGROUND_COLOR = vec3(0.0745, 0.051, 0.1255);

uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uIntensity;
uniform float uOpacity;
uniform int uPass;

in vec2 vPosition;
in vec2 vColor;
in vec3 vAuxiliary;
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
    float glow = vColor.y;
    float life = smoothstep(0.02, 0.95, vLife);

    if (uPass == 2) {
        vec2 point = gl_PointCoord * 2.0 - 1.0;
        float radius = length(point);
        float circle = 1.0 - smoothstep(0.5, 1.0, radius);
        float halo = (1.0 - smoothstep(0.2, 1.0, radius)) * 0.22;
        float saturation = 0.5 + pointerInfluence * 0.38;
        vec3 pointColor = mix(BACKGROUND_COLOR * 1.15, accent, saturation) * (0.78 + glow * 0.55);
        float alpha = (circle + halo) * life * uOpacity * (0.48 + uIntensity * 0.22);
        if (alpha < 0.01) discard;
        outColor = vec4(pointColor, alpha);
        return;
    }

    if (uPass == 1) {
        float edge = 1.0 - smoothstep(0.48, 1.0, abs(vAuxiliary.x));
        float edgeLife = clamp(vLife, 0.0, 1.0);
        vec3 edgeColor = mix(BACKGROUND_COLOR * 1.1, accent, 0.5 + pointerInfluence * 0.32);
        edgeColor *= 0.67 + glow * 0.36;
        float alpha = edge * edgeLife * uOpacity * (0.48 + uIntensity * 0.17 + pointerInfluence * 0.2);
        if (alpha < 0.005) discard;
        outColor = vec4(edgeColor, alpha);
        return;
    }

    vec3 purpleSurface = vec3(0.089, 0.051, 0.145);
    float facetEnergy = glow * (0.13 + uIntensity * 0.035) + pointerInfluence * 0.012;
    vec3 energizedSurface = mix(purpleSurface * 1.04, accent * 0.32 + purpleSurface * 0.76, facetEnergy);
    vec3 color = mix(BACKGROUND_COLOR * 0.94, energizedSurface, 0.58);

    outColor = vec4(color, uOpacity * mix(0.72, 1.0, life));
}
