
import { GetRandomVec2, TossCoin } from './Bounds.js'
export class Enemy extends Phaser.GameObjects.Sprite {

    glow;
    
    constructor(scene, x, y, texture) {
        
        super(scene, x, y, texture);
        
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        scene.add.existing(this);
        this.setScale(0.25);
        this.angle = 0;
        // this.max_velocity = 10;
    }
    
    setTarget(target)
	{
		this.target = target; // if target alive?
	}
    
    update() {
        // this.body.rotate += 0.05;
        this.angle += 1;
        if (this.target)
		{
            const tx = this.target.x;
            const ty = this.target.y;
            const x = this.body.x;
            const y = this.body.y;
            
            const rotation = Phaser.Math.Angle.Between(x, y, tx, ty);
            this.setRotation(rotation);
            //  game.physics.arcade.velocityFromRotation(rotation, 150, this.body.velocity);
		}
		this.scene.physics.velocityFromRotation(this.rotation, 150, this.body.velocity);
		this.glow.setPosition(this.body.x+this.body.width/2, this.body.y+this.body.height/2); // better way to do this or get coords
    }
    
    
    move() {
        // if(target.alive()) {
            
        // } else if() {
            
        // } else
    }
    
    
    static SpawnLoc(scene) {
    	let num = 400;
    	let bound_x = scene.physics.world.bounds.width;
    	let bound_y = scene.physics.world.bounds.height;
    	let r = {};

        if(!TossCoin(0.5)) {
			 if(!TossCoin(0.5)) {
				r = GetRandomVec2(bound_x, bound_x, 0.0, bound_y);
				r.x += num;
			 } else {
			     r = GetRandomVec2(0.0, 0.0, 0.0, bound_y);
			     r.x += -num;
			 }
        } else {
		    if(!TossCoin(0.5)) {
			    r = GetRandomVec2(0.0, bound_x, bound_y, bound_y);
			    r.y += num;
		    } else {
				r = GetRandomVec2(0.0, bound_x, 0.0, 0.0);
				r.y += -num;
		    }
    	}
    	return r;
    }
    
    
    
};


Phaser.GameObjects.GameObjectFactory.register('enemy', function (x, y, texture) {
	const cc = new Enemy(this.scene, x, y, texture);
    this.displayList.add(cc);
    this.updateList.add(cc);
    return cc;
});