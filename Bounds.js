// Ensures reticle does not move offscreen and dist(radius) from player. 
export function constrainReticle(reticle, player, radius) {
    var distX = reticle.x-player.x; // X distance between player & reticle
    var distY = reticle.y-player.y; // Y distance between player & reticle
    // fix this
    const SCALE = 1.6;
    const WIDTH = 1280*SCALE/2;
    const HEIGHT = 720*SCALE/2;
    
    // Ensures reticle cannot be moved offscreen
    // game.physics.getBottomRight();
    if (distX > WIDTH)
        reticle.x = player.x+WIDTH;
    else if (distX < -WIDTH)
        reticle.x = player.x-WIDTH;

    if (distY > HEIGHT)
        reticle.y = player.y+HEIGHT;
    else if (distY < -HEIGHT)
        reticle.y = player.y-HEIGHT;

    // Ensures reticle cannot be moved further than dist(radius) from player
    var distBetween = Phaser.Math.Distance.Between(player.x, player.y, reticle.x, reticle.y);
    if (distBetween > radius)
    {
        // Place reticle on perimeter of circle on line intersecting player & reticle
        var scale = distBetween/radius;

        reticle.x = player.x + (reticle.x-player.x)/scale;
        reticle.y = player.y + (reticle.y-player.y)/scale;
    }
}

export function CircleInRectX(circle, rect) {
	if(circle.x+circle.radius > rect.x + rect.w){
		//it is outside of the rectangle on the right side
		return false;
	}
	else if(circle.x-circle.radius < rect.x){
		//it is outside on the left side
		return false;
	}
	return true;
}

export function CircleInRectY(circle, rect) {
    if(circle.y+circle.radius > rect.y + rect.h) {
		//it is outside of the rectangle on the bottom side
		return false;
	}
	else if(circle.y-circle.radius < rect.y){
		//it is outside on the top side
		return false;
	}
	return true;
}

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