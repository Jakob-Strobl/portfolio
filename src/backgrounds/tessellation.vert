#version 300 es

precision highp float;

layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec2 aColor;
layout(location = 2) in vec3 aBarycentric;
layout(location = 3) in float aLife;

uniform float uPointSize;
uniform bool uPointPass;

out vec2 vPosition;
out vec2 vColor;
out vec3 vBarycentric;
out float vLife;

void main() {
    vPosition = aPosition;
    vColor = aColor;
    vBarycentric = aBarycentric;
    vLife = aLife;
    gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);
    gl_PointSize = uPointPass ? uPointSize : 1.0;
}
