import { BulletMan, Bullets } from './BulletMan.js';
import { normalize } from './Math.js';
import { Item, Items, ItemSound } from './Items.js';


export class Player extends Phaser.GameObjects.Sprite
{
    
    #a1; #a2;
    #weapon; #ammo
    #shoot;
    #keys;
    light;
    particles;
    lives;
    
    score;
    cooldown;
    
    constructor(scene, x, y, r) {
        let circ = scene.make.graphics()
            .fillStyle(0x6666ff)
            .fillCircle(r, r, r)   // x, y, radius
            .generateTexture('PlayerBody', r*2, r*2);
        circ.destroy();
        super(scene, x, y, 'PlayerBody');
        //--------------------------
        let circ2 = scene.make.graphics()
            .fillStyle(0x808080)
            .fillCircle(r, r, r/4)
            .strokeCircle(r,r,r/4)
            .generateTexture('arm', r*2, r*2);
        circ2.destroy();
        this.setDepth(0.05); // lame. worked better when was just drawing arms at every loop.
        this.a1 = scene.add.sprite(x+r, y, 'arm').setDepth(0.1);
        this.a2 = scene.add.sprite(x, y+r, 'arm').setDepth(0.1);
        //--------------------------
       
        
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        scene.add.existing(this);
        
        
        this.angle = 0;
        this.r = r;
        this.body.setMaxVelocity(200, 200);
        this.shoot = false;
        this.ammo = 0;
        this.score = 0;
        this.cooldown = 0;
        scene.input.keyboard.on("keyup", this.keyup, this);
        scene.input.on("pointerdown", this.mousedown, this);
        scene.input.on("pointerup", this.mouseup, this);

        this.keys = scene.input.keyboard.addKeys({ 
            W: Phaser.Input.Keyboard.KeyCodes.W, 
            A: Phaser.Input.Keyboard.KeyCodes.A, 
            S: Phaser.Input.Keyboard.KeyCodes.S, 
            D: Phaser.Input.Keyboard.KeyCodes.D, 
            UP: Phaser.Input.Keyboard.KeyCodes.UP,
            DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
            LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
            RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT
        });
        this.weapon = scene.add.item(x, y, Items.SLINGSHOT);
        //--------------------------------------------------
        this.particles = scene.add.particles('playerfrag');
        this.particles.createEmitter({
            angle: { min: 240, max: 300 },
            speed: { min: 400, max: 600 },
            quantity: { min: 2, max: 10 },
            lifespan: 4000,
            alpha: { start: 1, end: 0 },
            scale: { min: 0.05, max: 0.4 },
            rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
            gravityY: 800,
            on: false
        });
        this.lives = 3;
        this.light = this.scene.lights.addLight(0, 0, 150);
    }

    
    preUpdate(time, deltaTime) {
        super.preUpdate(time, deltaTime);
        this.keydown();
    }

    
    update(time, deltaTime) {
        const pc = this.body.center;
        this.light.setPosition(pc.x, pc.y);
        this.angle = Phaser.Math.Angle.Between(
            pc.x, pc.y, 
            this.scene.input.mousePointer.worldX, this.scene.input.mousePointer.worldY
        );
        const is_dir = (Math.abs(this.angle) < 1.5708);    // Am i facing left or right?
        
        if(this.shoot) {
            // wow this is really bad fix this.
            let outPos = this.weapon.getRightCenter();
            const dir = is_dir ?  -1 : 1;
            let offset = new Phaser.Geom.Point(20, 7*dir);
            Phaser.Math.Rotate(offset, this.weapon.rotation);
            outPos.y += offset.y;
            outPos.x += offset.x;
            
            switch(this.weapon.type) {
                case Items.CHAIN:
                    this.scene.cameras.main.shake(500);     //shake(0.05, 500);
                    this.body.x -= Math.cos(this.angle)*2;  // Push Player back
                    this.body.y -= Math.sin(this.angle)*2;
                    
                    this.scene.sound.play(ItemSound.CHAIN);
                    BulletMan.addBullet(Bullets.CHAIN, outPos, this.angle);
                    // spawn muzzle flash
                    --this.ammo;
                    this.scene.events.emit('ammoChange', this.ammo);
                    break;
                case Items.SLINGSHOT:
                    this.scene.sound.play(ItemSound.SLINGSHOT);
                    BulletMan.addBullet(Bullets.SLINGSHOT, outPos, this.angle);
                    this.shoot = false;
                    break;
                case Items.SHOTGUN: // lol get it
                    if(this.cooldown > 0) {
                        --this.cooldown;
                        break;
                    } else this.cooldown = 5;
                    this.scene.sound.play(ItemSound.SHOTGUN);
                    let dir1 = Math.sign(this.angle);
                    BulletMan.addBullet(Bullets.SHOTGUN, outPos, this.angle + dir1*0.10);
                    BulletMan.addBullet(Bullets.SHOTGUN, outPos, this.angle + dir1*0.05);
                    BulletMan.addBullet(Bullets.SHOTGUN, outPos, this.angle);
                    BulletMan.addBullet(Bullets.SHOTGUN, outPos, this.angle + dir1*-0.05);
                    this.shoot = false;
                    --this.ammo;
                    this.scene.events.emit('ammoChange', this.ammo);
                    break;
                    
                default:
            }
            if(this.ammo <= 0) {
                this.SetWeapon(Items.SLINGSHOT, this.ammo);
            }
            
        }
        Phaser.Math.RotateTo(this.a1, pc.x, pc.y, this.angle-0.7854, this.r);   // rotate arms
        Phaser.Math.RotateTo(this.a2, pc.x, pc.y, this.angle+0.7854, this.r);
        Phaser.Math.RotateTo(this.weapon, pc.x, pc.y, this.angle, this.r);      // rotate weapon
        this.weapon.rotation = this.angle;                                      // weapon angle
        this.weapon.setFlipY(!is_dir);                                           // not upside down.
    }
    
    
    keydown() {
        const A = this.keys.A.isDown || this.keys.LEFT.isDown;
        const D = this.keys.D.isDown || this.keys.RIGHT.isDown;
        const W = this.keys.W.isDown || this.keys.UP.isDown;
        const S = this.keys.S.isDown || this.keys.DOWN.isDown;
        
        if(A && !D)
            this.body.velocity.x -= this.body.maxVelocity.x;
        else if(D && !A)
            this.body.velocity.x += this.body.maxVelocity.x;
        else if(A && D)
            this.body.velocity.x = 0;
        
        if(W && !S)
            this.body.velocity.y -= this.body.maxVelocity.y;
        else if(S && !W)
            this.body.velocity.y += this.body.maxVelocity.y;
        else if(W && S)
            this.body.velocity.y = 0;
    }
    
    
    keyup(e) {
        switch(e.keyCode) {
            case 65: case 37: // left
                this.body.velocity.x = 0; break;
            case 87: case 38: // up 
                this.body.velocity.y = 0; break;
            case 68: case 39: // right
                this.body.velocity.x = 0; break;
            case 83: case 40: // down    
                this.body.velocity.y = 0; break;
        };
    }
    
    
    mousedown(e)    { this.shoot = true; }
    mouseup(e)      { this.shoot = false; }


    SetWeapon(weaponType, ammo) {
        if(weaponType == this.weapon.type) {
            this.ammo += ammo;
        } else {
            this.weapon.destroy();
            this.weapon = this.scene.add.item(this.x, this.y, weaponType);
            this.ammo = ammo;
        }
        this.scene.events.emit('ammoChange', this.ammo);
    }
    
    
    static DoDamage(enemy, player) {
        
        if(!player.alive()) return;
        console.log('respawning');
        // should only be one at a time.
        // burst player
        player.particles.emitParticleAt(player.x, player.y);
        // disable movement.
        player.body.moves = false;
        // disable input. keyboard disable may be redundant
        player.scene.input.keyboard.enabled = false;
        player.scene.input.off('pointerdown', player.pointerdown, player);
        // subtract lives
        --player.lives;
        // remove light
        player.light.setVisible(false);
        // update UI
        BulletMan.scene.events.emit('livesChange', player.lives);
        // check if gameover
        if(player.lives <= 0) {
            player.alpha = 0; // eh
            player.a1.alpha = 0;
            player.a2.alpha = 0;
            player.a2.alpha = 0;
            player.weapon.alpha = 0;
            // player.scene.pause();
            // physics pause()
            let gm = player.scene.sound.get('game_music');
            player.scene.tweens.add({
                targets:  gm,
                volume:   0,
                duration: 6000
            });
            player.scene.cameras.main.fadeOut(6000);
            // return;
            // go to gameover transition scene. or show image. destroy this scene?
        } else {
            // make player dissapear.
            // set status to dead.
            // make the player reapear.
            player.scene.tweens.add({
                targets: [ player, player.a1, player.a2, player.weapon ],
                alpha: { start: 0, to: 1},
                ease: 'Bounce.In',
                delay: 3000,
                onComplete: function () {
                    // enable movement.   some of this is redundant same with above
                    player.body.moves = true;
                    player.scene.input.keyboard.enabled = true;
                    player.light.setVisible(true);
                    player.scene.input.on('pointerdown', player.mousedown, player);
                }
            });
        }
    }
    
    alive() {
        return this.alpha == 1;
    }
    
};


Phaser.GameObjects.GameObjectFactory.register('player', function (x, y, r) {
	const pl1 = new Player(this.scene, x, y, r);
    this.displayList.add(pl1);
    this.updateList.add(pl1);
    return pl1;
});