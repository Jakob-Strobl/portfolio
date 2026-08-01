#version 300 es

precision highp float;
precision highp int;

const float TAU = 6.2831853;
const vec3 BACKGROUND_COLOR = vec3(0.0745, 0.051, 0.1255);
const vec2 LIGHT_DIRECTION = vec2(-0.6508, 0.7593);
const float TESSELLATION_VISUAL_OPACITY = 0.65;

uniform vec2 uResolution;
uniform float uTime;
uniform float uIntensity;
uniform float uOpacity;
uniform int uPass;

in vec2 vColor;
in vec3 vAuxiliary;
in float vLife;

out vec4 outColor;

vec3 rainbow(float hue) {
    return 0.54 + 0.46 * cos(TAU * (hue + vec3(0.0, 0.33, 0.67)));
}

void main() {
    float hue = vColor.x + uTime * 0.004;
    vec3 accent = rainbow(hue);
    float glow = vColor.y;
    float life = smoothstep(0.02, 0.95, vLife);

    if (uPass == 2) {
        vec2 point = gl_PointCoord * 2.0 - 1.0;
        float radius = length(point);
        float circle = 1.0 - smoothstep(0.5, 1.0, radius);
        float luminosity = vAuxiliary.z;
        float halo = (1.0 - smoothstep(0.2, 1.0, radius)) * (0.22 + luminosity * 0.045);
        vec3 pointColor = mix(BACKGROUND_COLOR * 1.15, accent, 0.5) * (0.78 + glow * 0.55);
        float sphereZ = sqrt(max(0.0, 1.0 - radius * radius));
        vec3 socketNormal = normalize(vec3(point, sphereZ));
        vec3 socketLight = normalize(vec3(LIGHT_DIRECTION, 1.16));
        float socketFacing = dot(socketNormal, socketLight);
        float highlight = exp(-dot(point - LIGHT_DIRECTION * 0.34, point - LIGHT_DIRECTION * 0.34) * 16.0);
        float contactRim = smoothstep(0.58, 0.98, radius);
        pointColor *= 0.94 + max(socketFacing, 0.0) * 0.075 - max(-socketFacing, 0.0) * 0.055 - contactRim * 0.13;
        pointColor += vec3(0.31, 0.25, 0.42) * highlight * 0.12;
        pointColor = mix(pointColor, accent * 0.88 + vec3(0.08, 0.06, 0.11), luminosity * 0.13);
        float alpha = (circle + halo) * life * uOpacity * TESSELLATION_VISUAL_OPACITY * (0.48 + uIntensity * 0.22);
        if (alpha < 0.01) discard;
        outColor = vec4(pointColor, alpha);
        return;
    }

    if (uPass == 1) {
        float edgeDistance = abs(vAuxiliary.x);
        float edgeDerivative = max(fwidth(edgeDistance), 0.001);
        float featherStart = clamp(0.58 - edgeDerivative, 0.32, 0.58);
        float edge = 1.0 - smoothstep(featherStart, 1.0, edgeDistance);
        float edgeLife = clamp(vLife, 0.0, 1.0);
        vec3 edgeColor = mix(BACKGROUND_COLOR * 1.1, accent, 0.5);
        edgeColor *= 0.67 + glow * 0.36;
        vec2 edgeNormal = normalize(vAuxiliary.yz);
        vec2 bevelNormal = edgeNormal * sign(vAuxiliary.x);
        float lightFacing = dot(bevelNormal, LIGHT_DIRECTION);
        float bevel = smoothstep(0.30, 0.64, edgeDistance) * (1.0 - smoothstep(0.76, 0.96, edgeDistance));
        float bevelHighlight = max(lightFacing, 0.0) * bevel;
        float bevelShadow = max(-lightFacing, 0.0) * bevel;
        edgeColor = mix(edgeColor, BACKGROUND_COLOR * 0.46, bevelShadow * 0.34);
        edgeColor += vec3(0.29, 0.23, 0.40) * bevelHighlight * 0.16;
        float alpha = edge * edgeLife * uOpacity * TESSELLATION_VISUAL_OPACITY * (0.48 + uIntensity * 0.17);
        if (alpha < 0.005) discard;
        outColor = vec4(edgeColor, alpha);
        return;
    }

    vec3 purpleSurface = vec3(0.089, 0.051, 0.145);
    vec3 restingSurface = mix(BACKGROUND_COLOR * 0.96, purpleSurface, 0.42);
    vec3 stainedAccent = rainbow(vAuxiliary.y);
    vec3 stainedSurface = stainedAccent * 0.27 + purpleSurface * 0.79;
    restingSurface = mix(restingSurface, stainedSurface, vAuxiliary.x);
    float wake = smoothstep(0.08, 0.88, glow);
    float facetEnergy = wake * (0.19 + uIntensity * 0.065);
    vec3 energizedSurface = accent * 0.36 + purpleSurface * 0.72;
    vec3 color = mix(restingSurface, energizedSurface, facetEnergy);
    float mirageWave = 0.5 + 0.5 * sin(uTime * 0.07 + vAuxiliary.y * TAU * 2.3);
    float mirageCycle = smoothstep(0.12, 0.88, mirageWave);
    vec3 mirageSurface = rainbow(vAuxiliary.y + 0.14) * 0.22 + purpleSurface * 0.81;
    color = mix(color, mirageSurface, vLife * mirageCycle);
    color *= 1.0 + vAuxiliary.z * 0.03;

    // Keep fill coverage opaque so overlapping topology transitions crossfade cleanly.
    // Soften the visual intensity through the color instead of making the mesh translucent.
    color = mix(BACKGROUND_COLOR, color, TESSELLATION_VISUAL_OPACITY);
    outColor = vec4(color, uOpacity);
}
