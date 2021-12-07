import { GetRandomVec2, TossCoin } from './Math.js'

// change this enum to correspond to texture
export const Enemies = Object.freeze({
    GREEN:   "virus_green",
    RED:     "virus_red",
    BLUE:    "virus_blue"
});


function testDest() {
    console.log("destroy");
}

export class Enemy extends Phaser.GameObjects.Sprite {

    hp;
    type;
    v = 70;
    
    skip = 0; // big only. probably be better if I do it based on time or something.s
    
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.physics.world.enable(this);
        if(texture != Enemies.RED)      // makes my janky camera/world bounds check work
            this.body.setCollideWorldBounds(true);
        
        scene.add.existing(this);
        this.setScale(0.25);
        this.angle = 0;
        this.setDepth(0.2);
        
      
        
    }
    
    
    setTarget(target)
	{
		this.target = target; // if target alive?
	}
    
    #updateRotation() {
        const c = this.getCenter();
        if(this.target) {
            const tc = this.target.getCenter();
            const rotation = Phaser.Math.Angle.Between(c.x, c.y, tc.x, tc.y);
            this.setRotation(rotation);
            //  game.physics.arcade.velocityFromRotation(rotation, 150, this.body.velocity);
		} else {
		    // make them go the opposite way
		    this.rotation = -this.rotation;
		}
    }
    
    
    update(t, dt) {
        // console.log(this.rotation);
        // this.setFlipY(this.rotation > 1.5708 && this.rotation < 4.71239);  // i guess this doesnt work with shaders

        switch(this.type) {
            case Enemies.BLUE:
                // var d = +new Date();
                // this.rotation = 0.04 * Math.cos(d/1000);
                // Phaser.Math.RotateTo(this, this.x, this.y, 0.04 * Math.cos(d/1000), 0.5);
                // break;
            case Enemies.GREEN:
                this.#updateRotation();
                this.scene.physics.velocityFromRotation(this.rotation, this.v, this.body.velocity);
                break;
            case Enemies.RED:
                if(this.hp == 2) {
                    this.#updateRotation();
                    this.scene.physics.velocityFromRotation(this.rotation, this.v, this.body.velocity);
                } else {    // frenzy mode
                    if(Math.floor(Math.abs(this.body.velocity.x))-5 < 0) {
                            // "turn off" damage
                            this.hp = 1e12;
                            // // wait some time
                            if(this.skip < 50) { 
                                ++(this.skip); 
                                this.body.acceleration.x = 0;
                                this.body.acceleration.y = 0;
                                this.body.velocity.x = 0;
                                this.body.velocity.y = 0;
                                this.#updateRotation();
                            } else { 
                                this.skip = 0;
                                // turn on damage
                                this.hp = 1;
                                // charge
                                this.scene.physics.velocityFromRotation(this.rotation, this.v, this.body.velocity);
                            }
                    } else {
                        // or if collides world
                        // if(Phaser.Geom.Intersects.RectangleToRectangle(this.body.getBounds(), this.scene.cameras.main.getBounds()))
                            
                            const x = ((Math.sign(Math.cos(this.rotation)) > 0) ? this.body.width : 0);
                            const y = ((Math.sign(Math.sin(this.rotation)) > 0) ? this.body.height : 0);
                            // make this not dumb (repeating)
                            const x1 = ((Math.sign(Math.cos(this.rotation)) < 0) ? this.body.width : 0); // make this better written
                            const y1 = ((Math.sign(Math.sin(this.rotation)) < 0) ? this.body.height : 0);
                            
                            if(this.scene.cameras.main.worldView.contains(this.body.x + x1, this.body.y + y1)) {          // contain to camera.
                                if(!this.scene.cameras.main.worldView.contains(this.body.x + x, this.body.y + y)) {
                                    this.body.setVelocity(0);
                                }
                            }
                            
                    }
                   
                }
                break;
        }
        
        
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