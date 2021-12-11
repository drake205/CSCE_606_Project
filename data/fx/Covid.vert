precision mediump float;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec2 uResolution;
attribute vec2 inPosition;
varying vec2 fragCoord;
varying vec2 outTexCoord;
void main () {
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);
    fragCoord = vec2(inPosition.x, uResolution.y - inPosition.y);
    outTexCoord = vec2(inPosition.x / uResolution.x, fragCoord.y / uResolution.y);
}