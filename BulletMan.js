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
        scene.physics.add.overlap(BulletMan.bullets, EntityMan.enemies, doDamage); // or collide
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
        b.rotation = Math.atan2(dir.y, dir.x); // lol. angle->vector->angle. pass angle instead. use cos(angle), sin(angle) for dir
    }
      
};

// Hit. dont need hit manager?
function doDamage(Bullet, Enemy) {
    // destroy bullet
    // destroy entity? damage health?
    console.log("bullet hit");
    Bullet.destroy(); // so maybe stop
}


class Bullet extends Phaser.GameObjects.Sprite {
    
    #size1;
    #type;
    dir;
    
     
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(false);
        // this.body.collideWorldBounds = true;
        scene.add.existing(this);
        // if non round bullets also need to set angle
    }
    
   create(data) {
        console.log("bulletCreate");   
   }
    update(t, dt) {
        const speed = 700;
        this.body.velocity.x = this.dir.x * speed;
        this.body.velocity.y = this.dir.y * speed;
        // if(!this.physics.world.bounds.contains(this.body.x, this.body.y)) {
        // console.log(this.body.checkWorldBounds())
        // console.log(this.body.onWorldBounds)
        if(this.body.checkWorldBounds()) {
            // this.setVisible(false);
            // this.body.setEnable(false);
            this.destroy(); // maybe not destroy. supposed to be expensive.
        }
    }
    
    
};
