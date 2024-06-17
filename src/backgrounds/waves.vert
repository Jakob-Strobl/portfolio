precision mediump float;

uniform float time;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

const int num_waves = 4;
uniform struct Wave {
    vec2 direction;
    float amplitude;
    float length;
    float speed;
    float frequency;
    float steepness;
} waves[4];

attribute vec3 position;

varying vec3 vPos;

// Fancy math referenced from https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models
vec3 gerstnerWaves(vec3 position, float time) {
    vec3 summedWaves = position;
    for (int i = 0; i < num_waves; i++) {
        float phase = (waves[i].speed * 2.0 / (waves[i].length)) * time;
        float theta = dot((waves[i].direction), position.xz) * waves[i].frequency + phase;
        
        // Height
        summedWaves.y += waves[i].amplitude * sin(theta);

        float horizontal = waves[i].steepness * waves[i].amplitude * cos(theta);
        summedWaves.x += waves[i].direction.x * horizontal;
        summedWaves.z += waves[i].direction.y * horizontal;
    }

    return summedWaves;
}

vec3 sumOfSineWaves(vec3 position, float time) {
    vec3 summedWaves = position;
    for (int i = 0; i < num_waves; i++) {
        float phase = (waves[i].speed * 2.0 / waves[i].length) * time;
        float theta = dot(waves[i].direction, position.xz) * waves[i].frequency + phase;
        summedWaves.y += waves[i].amplitude * sin(theta);
    }
    return summedWaves;
}

void main() {
    vPos = gerstnerWaves(position, time);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
}