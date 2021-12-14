
export function TossCoin(prob) {
	return (Math.random() < prob);
}
export function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

export function GetRandomVec2(xMin, xMax, yMin, yMax) {
	return { x: getRandom(xMin, xMax), y: getRandom(yMin, yMax) };
}