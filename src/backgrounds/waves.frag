#version 300 es

precision highp float;

const float TAU = 6.2831853;
const vec3 FOG_COLOR = vec3(0.0745, 0.051, 0.1255);

uniform float uTime;
uniform float uIntensity;

in vec3 vWorldPosition;
in float vCameraDepth;

out vec4 outColor;

void main() {
    float hue = vWorldPosition.x * 0.012 + vWorldPosition.z * 0.006
        + vWorldPosition.y * 0.16 + uTime * 0.008;
    vec3 rainbow = 0.56 + 0.44 * cos(TAU * (hue + vec3(0.0, 0.33, 0.67)));
    vec3 surfaceNormal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));
    float diffuseLight = 0.82 + 0.18 * abs(dot(surfaceNormal, normalize(vec3(-0.35, 0.8, 0.48))));
    rainbow *= diffuseLight;

    float normalizedIntensity = clamp((uIntensity - 0.5) / 0.85, 0.0, 1.0);
    float crest = smoothstep(
        mix(-2.45, -2.58, normalizedIntensity),
        mix(-1.35, -1.55, normalizedIntensity),
        vWorldPosition.y
    );
    float spatialBands = 0.5 + 0.5 * sin(
        vWorldPosition.x * 0.14 + vWorldPosition.z * 0.105
            + sin(vWorldPosition.x * 0.055 - vWorldPosition.z * 0.035) * 0.8
    );
    float spatialMask = smoothstep(mix(0.72, 0.5, normalizedIntensity), 0.94, spatialBands);
    float troughColor = mix(0.04, 0.1, normalizedIntensity);
    float crestColor = crest * mix(0.24, 0.82, spatialMask);
    float colorPresence = clamp(troughColor + crestColor, 0.0, 1.0);
    float distanceVisibility = mix(0.07, 1.0, 1.0 - smoothstep(13.0, 82.0, vCameraDepth));

    outColor = vec4(mix(FOG_COLOR, rainbow, colorPresence * distanceVisibility), 1.0);
}
