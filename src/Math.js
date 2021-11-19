
export function TossCoin(prob) {
	return (Math.random() < prob);
}
export function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

export function GetRandomVec2(xMin, xMax, yMin, yMax) {
	return { x: getRandom(xMin, xMax), y: getRandom(yMin, yMax) };
}

export function normalize(vec2) {
    let v = Math.sqrt(vec2.x*vec2.x + vec2.y*vec2.y);
    return { x: vec2.x / v, y: vec2.y / v };
}