#version 300 es

precision highp float;
precision highp int;

layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec2 aColor;
layout(location = 2) in vec3 aAuxiliary;
layout(location = 3) in float aLife;

uniform float uPointSize;
uniform int uPass;
uniform vec2 uResolution;
uniform float uEdgeHalfWidth;

out vec2 vColor;
out vec3 vAuxiliary;
out float vLife;

void main() {
    vColor = aColor;
    vAuxiliary = aAuxiliary;
    vLife = aLife;
    vec2 position = aPosition;
    if (uPass == 1) {
        position += aAuxiliary.yz * aAuxiliary.x * uEdgeHalfWidth / uResolution;
    }
    gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
    gl_PointSize = uPass == 2 ? uPointSize * aAuxiliary.y : 1.0;
}
