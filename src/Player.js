import { BulletMan, Bullets, score_fade } from './BulletMan.js';
import { Items, ItemSound } from './Items.js';


export class Player extends Phaser.GameObjects.Sprite
{
    
    a1; a2;
    weapon; ammo
    shoot;
    keys;
    
    radius;
    lives;
    light;
    particles;
    
    score;
    cooldown;
    
    
    constructor(scene, x, y, r) {
        
        let circBody = scene.make.graphics()
            .fillStyle(0x6666ff)
            .fillCircle(r, r, r)
            .generateTexture('PlayerBody', r*2, r*2);
        circBody.destroy();
        
        super(scene, x, y, 'PlayerBody');
        
        let circArm = scene.make.graphics()
            .fillStyle(0x808080)
            .fillCircle(r, r, r/4)
            .strokeCircle(r,r,r/4)
            .generateTexture('arm', r*2, r*2);
        circArm.destroy();
        this.setDepth(0.05);
        this.a1 = scene.add.sprite(x+r, y, 'arm').setDepth(0.1);
        this.a2 = scene.add.sprite(x, y+r, 'arm').setDepth(0.1);
        //--------------------------
        
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        scene.add.existing(this);
        this.body.setCircle(r);
        //--------------------------------------------------
        if(!scene.sys.game.device.os.desktop) {
            scene.input.addPointer(2);
            this.j1 = scene.plugins.get('rexvirtualjoystickplugin').add(scene, {
                    x: 150, y: scene.cameras.main.displayHeight-150,
                    radius: 100,
            });
            this.cursorKeys = this.j1.createCursorKeys();
            this.pressedKeys = [];
        }
        //--------------------------------------------------
        
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
        
        //--------------------------------------------------
        
        this.weapon = scene.add.item(x, y, Items.SLINGSHOT);
        this.light = this.scene.lights.addLight(0, 0, 150);
        this.angle = 0;
        this.radius = r;
        this.body.setMaxVelocity(200, 200);
        this.shoot = false;
        this.ammo = 0;
        this.score = 0;
        this.cooldown = 0;
        this.lives = 4;
    }

    
    preUpdate(time, deltaTime) {
        super.preUpdate(time, deltaTime);
        this.keydown();
    }

    
    update(time, dt) {
        const pc = this.body.center;
        if(this.scene.sys.game.device.os.desktop) {
            this.angle = Phaser.Math.Angle.Between(
                pc.x, pc.y, 
                this.scene.input.mousePointer.worldX, this.scene.input.mousePointer.worldY
            );
        } else {
            let pointer = (this.j1.pointerX == this.scene.input.pointer1.worldX) ? this.scene.input.pointer2 : this.scene.input.pointer1;
            this.angle = Phaser.Math.Angle.Between(
                pc.x, pc.y, 
                pointer.worldX, pointer.worldY
            );
        }
        const is_dir = (Math.abs(this.angle) < 1.5708);    // Am i facing left or right?
        
        if(this.shoot) {
            // messy fix this.
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
                    // To do: spawn muzzle flash
                    --this.ammo;
                    this.scene.events.emit('ammoChange', this.ammo);
                    if(this.ammo <= 0)
                        this.SetWeapon(Items.SLINGSHOT, this.ammo);
                    break;
                case Items.SLINGSHOT:
                    this.scene.sound.play(ItemSound.SLINGSHOT);
                    BulletMan.addBullet(Bullets.SLINGSHOT, outPos, this.angle);
                    this.shoot = false;
                    break;
                case Items.SHOTGUN: // lol get it
                    if(this.cooldown > 0) {
                        this.cooldown -= dt;
                        break;
                    } else this.cooldown = 83;
                    this.scene.sound.play(ItemSound.SHOTGUN);
                    let dir1 = Math.sign(this.angle);
                    BulletMan.addBullet(Bullets.SHOTGUN, outPos, this.angle + dir1*0.10);
                    BulletMan.addBullet(Bullets.SHOTGUN, outPos, this.angle + dir1*0.05);
                    BulletMan.addBullet(Bullets.SHOTGUN, outPos, this.angle);
                    BulletMan.addBullet(Bullets.SHOTGUN, outPos, this.angle + dir1*-0.05);
                    this.shoot = false;
                    --this.ammo;
                    this.scene.events.emit('ammoChange', this.ammo);
                    if(this.ammo <= 0)
                        this.SetWeapon(Items.SLINGSHOT, this.ammo);
                    break;
                    
                default:
            }
            
            
        }
        
        // positioning
        this.light.setPosition(pc.x, pc.y);
        Phaser.Math.RotateTo(this.a1, pc.x, pc.y, this.angle-0.7854, this.radius);   // rotate arms
        Phaser.Math.RotateTo(this.a2, pc.x, pc.y, this.angle+0.7854, this.radius);
        Phaser.Math.RotateTo(this.weapon, pc.x, pc.y, this.angle, this.radius);      // rotate weapon
        this.weapon.rotation = this.angle;                                           // weapon angle
        this.weapon.setFlipY(!is_dir);                                               // not upside down.
    }
    
    
    keydown() {
        let A = this.keys.A.isDown || this.keys.LEFT.isDown;
        let D = this.keys.D.isDown || this.keys.RIGHT.isDown;
        let W = this.keys.W.isDown || this.keys.UP.isDown;
        let S = this.keys.S.isDown || this.keys.DOWN.isDown;
        if(!this.scene.sys.game.device.os.desktop) {
            A |= this.cursorKeys.left.isDown;
            D |= this.cursorKeys.right.isDown;
            W |= this.cursorKeys.up.isDown;
            S |= this.cursorKeys.down.isDown;
            if(this.pressedKeys[1] != A)
                this.keyup({keyCode: 65});
            if(this.pressedKeys[2] != D) // 
                this.keyup({keyCode: 68});
            if(this.pressedKeys[3] != W)
                this.keyup({keyCode: 87});
            if(this.pressedKeys[4] != S)
                this.keyup({keyCode: 83});
                
            this.pressedKeys[1] = A; 
            this.pressedKeys[2] = D; 
            this.pressedKeys[3] = W; 
            this.pressedKeys[4] = S; 
        }
        
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
        }
    }
    
    
    mousedown(e)    { this.shoot = true; }
    mouseup(e)      { this.shoot = false; }


    SetWeapon(weaponType, ammo) {
        this.scene.sound.play('pickup_item');
        if(weaponType == this.weapon.type) {
            this.ammo += ammo;
            score_fade(this.x+50, this.y-50, '+'+ammo);
        } else {
            this.weapon.destroy();
            this.weapon = this.scene.add.item(this.x, this.y, weaponType);
            this.ammo = ammo;
            // if not alive, and picked up weapon somehow, match the alpha of respawn.
            if(!this.alive()) this.weapon.alpha = this.alpha;
        }
        this.scene.events.emit('ammoChange', this.ammo);
    }
    
    
    static DoDamage(enemy, player) {
        if(!player.alive()) return;
        // burst player
        player.particles.emitParticleAt(player.x, player.y);
        // Player disapear & set status to dead. alpha != 1 == dead
        player.alpha = 0;
        player.a1.alpha = 0;
        player.a2.alpha = 0;
        player.a2.alpha = 0;
        player.weapon.alpha = 0;
        // Turn off machine gun if shooting
        player.shoot = false;
        // disable movement.
        player.body.moves = false;
        // disable input. keyboard & mouse event
        player.scene.input.off('pointerdown', player.pointerdown, player);
        // subtract lives
        --player.lives;
        // turn off light
        player.light.setIntensity(0.01); // dont turn off completely. bug in phaser makes screen go black.
        // update UI
        BulletMan.scene.events.emit('livesChange', player.lives);
        // check if gameover
        if(player.lives <= 0) {
            // fade out game music
            const time_ms = 6000;
            let gm = player.scene.sound.get('game_music');
            player.scene.tweens.add({
                targets:  gm,
                volume:   0,
                duration: time_ms,
                onComplete: function() {
                    gm.destroy();
                }
            });
            // fade out camera
            player.scene.cameras.main.fadeOut(time_ms);
        } else {
            // make player respawn, Blink in
            player.scene.tweens.add({
                targets: [ player, player.a1, player.a2, player.weapon ],
                alpha: { start: 0, to: 1},
                ease: 'Bounce.In',
                delay: 3000,
                onComplete: function () {
                    // enable movement.   some of this is redundant same with above
                    player.body.moves = true;
                    player.light.setIntensity(1);
                    player.scene.input.on('pointerdown', player.mousedown, player);
                    // player.body.stop(); // clear any leftover velocity
                }
            });
        }
    }
    

    alive() { return this.alpha == 1; }


}


Phaser.GameObjects.GameObjectFactory.register('player', function (x, y, r) {
	const pl1 = new Player(this.scene, x, y, r);
    this.displayList.add(pl1);
    this.updateList.add(pl1);
    return pl1;
});