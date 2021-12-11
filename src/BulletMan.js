import { EntityMan } from "./EntityMan.js";
import { Enemies } from "./Enemies.js";


export const Bullets = {
    CHAIN : 'chainAmmo',
    SLINGSHOT : 'slingAmmo',
    SHOTGUN : 'shotgunAmmo'
};

export class BulletMan { 
    
    static bullets;  
    static scene;
      
    static Init(scene) {
        BulletMan.bullets = scene.add.group({
            classType: Bullet,
            runChildUpdate: true
        });
        scene.physics.add.overlap(BulletMan.bullets, EntityMan.enemies, doDamage); 
        BulletMan.scene = scene;
    }
    
    
    static Update(t, dt) {}
    
    
    static addBullet(type, loc, angle) {
        let b = BulletMan.bullets.get(loc.x, loc.y, type);
        const dir = { x: Math.cos(angle), y: Math.sin(angle) };
        b.dir = dir;        // trajectory
        b.rotation = angle; // sprite direction
        // b.setPipeline('Light2D'); // makes bullets too dark
        switch(type) {  // might be different for a diff bullet.
            case Bullets.SHOTGUN:
            case Bullets.SLINGSHOT:
            case Bullets.CHAIN:
                b.setScale(0.2);
                break;
        }
    }
      
}


export function score_fade(x, y, score) {
    let scoreText = EntityMan.scene.add.text(x, y, score).setFontSize(30).setFontFamily("Courier New").setOrigin(0.5);
    BulletMan.scene.tweens.add({
        targets: scoreText,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete:function(){
            scoreText.destroy();  
        }
    });
}


function doDamage(Bullet, Enemy) {
    
    
    
    switch(Enemy.type) {
        case Enemies.GREEN:
            Enemy.scene.sound.play('death1');
            Bullet.destroy();       // might be better to just disable and hide
            Enemy.destroy();        // kill&hide
            EntityMan.SpawnEnemy(Enemy.type);
            EntityMan.player.score += 100;
            EntityMan.scene.events.emit('scoreChange', EntityMan.player.score);
            score_fade(Enemy.x, Enemy.y, '100');
            break;
        case Enemies.RED:
            --Enemy.hp;
            Bullet.destroy(); 
            if(Enemy.hp <= 0) {
                Enemy.scene.sound.play('death2');
                Enemy.destroy();     
                EntityMan.SpawnEnemy(Enemy.type);
                EntityMan.player.score += 500;
                EntityMan.scene.events.emit('scoreChange', EntityMan.player.score);
                score_fade(Enemy.x, Enemy.y, '500');
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
                EntityMan.player.score += 300;
                EntityMan.scene.events.emit('scoreChange', EntityMan.player.score);
                score_fade(Enemy.x, Enemy.y, '300');
            } else {
                BulletMan.scene.tweens.add({
                  targets     : Enemy ,
                  scale       : Enemy.scaleX*1.5,
                  ease        : 'Linear',
                  duration    : 500,
                });
            }
            break;
            
    }
}


class Bullet extends Phaser.GameObjects.Sprite {
    
    #size1;
    #type;
    dir;
    
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(false);
        
        scene.add.existing(this);
        this.setDepth(0.2);
    }
    
    
    update(t, dt) {
        const speed = 700;
        this.body.velocity.x = this.dir.x * speed;
        this.body.velocity.y = this.dir.y * speed;
        if(this.body.checkWorldBounds()) {
            this.destroy(); 
        }
    }
    
    
}
