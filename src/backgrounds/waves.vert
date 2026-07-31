#version 300 es

precision highp float;

const int WAVE_COUNT = 4;
const float NEAR_PLANE = 0.1;
const float FAR_PLANE = 120.0;
const float FOCAL_LENGTH = 1.7320508;
const vec3 CAMERA_POSITION = vec3(0.0, 4.0, 13.0);
const vec3 CAMERA_FORWARD = vec3(0.0, -0.3047757, -0.9524241);
const vec3 CAMERA_UP = vec3(0.0, 0.9524241, -0.3047757);

layout(location = 0) in vec3 aPosition;

uniform vec2 uWaveDirections[WAVE_COUNT];
uniform float uWaveAmplitudes[WAVE_COUNT];
uniform float uWaveNumbers[WAVE_COUNT];
uniform float uAngularFrequencies[WAVE_COUNT];
uniform float uWaveSteepness[WAVE_COUNT];
uniform float uWavePhases[WAVE_COUNT];
uniform float uIntensity;
uniform float uTime;
uniform float uAspectRatio;

out vec3 vWorldPosition;
out float vCameraDepth;

void main() {
    vec3 worldPosition = aPosition;

    for (int index = 0; index < WAVE_COUNT; index += 1) {
        float theta = dot(uWaveDirections[index], aPosition.xz) * uWaveNumbers[index]
            - uAngularFrequencies[index] * uTime + uWavePhases[index];
        float amplitude = uWaveAmplitudes[index] * uIntensity;

        worldPosition.y += amplitude * sin(theta);
        worldPosition.xz += uWaveDirections[index]
            * (uWaveSteepness[index] * amplitude * cos(theta));
    }

    vec3 cameraDelta = worldPosition - CAMERA_POSITION;
    float cameraDepth = dot(cameraDelta, CAMERA_FORWARD);
    float viewX = cameraDelta.x;
    float viewY = dot(cameraDelta, CAMERA_UP);
    float projectedDepth = ((FAR_PLANE + NEAR_PLANE) / (FAR_PLANE - NEAR_PLANE)) * cameraDepth
        - ((2.0 * FAR_PLANE * NEAR_PLANE) / (FAR_PLANE - NEAR_PLANE));

    vWorldPosition = worldPosition;
    vCameraDepth = cameraDepth;
    gl_Position = vec4(
        viewX * FOCAL_LENGTH / uAspectRatio,
        viewY * FOCAL_LENGTH,
        projectedDepth,
        cameraDepth
    );
}
