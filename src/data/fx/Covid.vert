#version 300 es
precision mediump float;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec2 uResolution;
in vec2 inPosition;
out vec2 fragCoord;
out vec2 outTexCoord;
void main () {
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);
    fragCoord = vec2(inPosition.x, uResolution.y - inPosition.y);
    outTexCoord = vec2(inPosition.x / uResolution.x, fragCoord.y / uResolution.y);
}