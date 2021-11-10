import { EntityMan } from "./EntityMan.js";
import { Enemy } from "./Enemies.js";

export class BulletMan { 
    
    static bullets;  
    static scene;
      
    static Init(scene) { ;
        BulletMan.bullets = scene.add.group({
            classType: Bullet,
            runChildUpdate: true
        });
        scene.physics.add.overlap(BulletMan.bullets, EntityMan.enemies, doDamage);
        BulletMan.scene = scene;
        // super(scene); scene.add.existing(this)
    }
    
    // static Init(scene) {}
      
    static Update(t, dt) {
    }
    
    static addBullet(type, loc, dir) {
        // do switch based on type here. make a enum of types/texture
        let b = BulletMan.bullets.get(loc.x, loc.y, type);
        b.dir = dir;
    }
      
};

// Hit. dont need hit manager?
function doDamage(Bullet, Enemy) {
    // destroy bullet
    // destroy entity? damage health?
    console.log("bullet hit");
}


class Bullet extends Phaser.GameObjects.Sprite {
    
    #size1;
    #type;
    dir;
     
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        scene.add.existing(this);
        // if non round bullets also need to set angle
    }
    
   
    update(t, dt) {
        // no longer moves using time. normalize trajectory in send.
        this.body.velocity.x = this.dir.x * (dt/60);
        this.body.velocity.y = this.dir.y * (dt/60);
    }
    
    
};
