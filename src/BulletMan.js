import { EntityMan } from "./EntityMan.js";
import { Enemy, Enemies } from "./Enemies.js";

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
    }
    
    
    static Update(t, dt) {}
    
    
    static addBullet(type, loc, angle) {
        // do switch based on type here. make a enum of types/texture
        const dir = { x: Math.cos(angle), y: Math.sin(angle) };
        let b = BulletMan.bullets.get(loc.x, loc.y, type);
        b.dir = dir;        // trajectory
        b.rotation = angle; // sprite direction
    }
      
};


function doDamage(Bullet, Enemy) {

    switch(Enemy.type) {
        case Enemies.GREEN:
            Enemy.scene.sound.play('death1');
            Bullet.destroy();       // might be better to just disable and hide
            Enemy.destroy();        // maybe just reposition off camera. // kill&hide
            EntityMan.SpawnEnemy(Enemy.type);
            break;
        case Enemies.RED:
            --Enemy.hp;
            Bullet.destroy(); 
            if(Enemy.hp <= 0) {
                Enemy.scene.sound.play('death2');
                Enemy.destroy();     
                EntityMan.SpawnEnemy(Enemy.type);
            } else {
                Enemy.v = 1000;
                Enemy.body.velocity.x = 0;
            }
            break;
        case Enemies.BLUE:
            --Enemy.hp;
            Bullet.destroy();
            if(Enemy.hp <= 0) {
                Enemy.scene.sound.play('death1');
                Enemy.destroy();      
                EntityMan.SpawnEnemy(Enemy.type);
            } else {
                BulletMan.scene.tweens.add({
                  targets     : Enemy ,
                  scale       : Enemy.scaleX*1.5,
                  ease        : 'Linear',
                  duration    : 500,
                });
            }
            break;
            
    };
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
        this.setDepth(0.2);
        // if non round bullets also need to set angle
    }
    
    
    update(t, dt) {
        const speed = 700;
        this.body.velocity.x = this.dir.x * speed;
        this.body.velocity.y = this.dir.y * speed;
        if(this.body.checkWorldBounds()) {
            // this.setVisible(false);
            // this.body.setEnable(false);
            this.destroy(); // maybe not destroy. supposed to be expensive.
        }
    }
    
    
};
