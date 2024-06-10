precision mediump float;
        
const vec3 cameraPos = vec3(0.0, 1.0, 10.0);
const vec3 fogColor = vec3(0.0745,0.05098,0.12549);
uniform float sineTime; 

varying vec3 vPos;

// Functions rgb2hsv() and hsv2rgb() are from http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float fogAmount(vec3 position) {
    return 1.0 - exp(-length(position - cameraPos) * 0.25);
}

vec3 addFog(vec3 color) {
    return mix(color, fogColor, fogAmount(vPos));
}

void main() {
    vec3 color = vec3(0.0, 0.0, 1.0);
    color.b += vPos.y;
    vec3 hsv = rgb2hsv(color);
    hsv.r = (hsv.r + sineTime + (vPos.x / 50.0)) / 1.0;
    gl_FragColor = vec4(addFog(hsv2rgb(hsv)), 1.0);
}