// Ensures reticle does not move offscreen and dist(radius) from player
export function constrainReticle(reticle, player, radius) {
    var distX = reticle.x-player.x; // X distance between player & reticle
    var distY = reticle.y-player.y; // Y distance between player & reticle

    // Ensures reticle cannot be moved offscreen
    if (distX > 800)
        reticle.x = player.x+800;
    else if (distX < -800)
        reticle.x = player.x-800;

    if (distY > 600)
        reticle.y = player.y+600;
    else if (distY < -600)
        reticle.y = player.y-600;

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