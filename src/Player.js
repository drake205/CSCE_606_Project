import { BulletMan } from './BulletMan.js';
import { normalize } from './Math.js';


// WEAPON ENUM
const Weapons = Object.freeze({
    GUN:   Symbol("weapon")
});


export class Player extends Phaser.GameObjects.Sprite
{
    #a1; #a2;
    #weapon; #ammo
    #shoot;
    #keys;

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
        this.setDepth(0); // lame. worked better when was just drawing arms at every loop.
        this.a1 = scene.add.sprite(x+r, y, 'arm').setDepth(0.1);
        this.a2 = scene.add.sprite(x, y+r, 'arm').setDepth(0.1);
        //--------------------------
        
        
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        scene.add.existing(this);
        
        this.angle = 0;
        this.r = r;
        this.body.setMaxVelocity(300, 300);
        this.max_velocity = 300;
        this.shoot = false;
        this.weapon = Weapons.GUN;  // default weapon

        
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
    }

    
    preUpdate(time, deltaTime) {
        super.preUpdate(time, deltaTime);
        this.keydown();
    }

    
    update(time, deltaTime) {
        const pc = this.body.center;
        this.angle = Phaser.Math.Angle.Between(
            pc.x, pc.y, 
            this.scene.input.mousePointer.worldX, this.scene.input.mousePointer.worldY
        );
        
        if(this.shoot) {
            switch(this.weapon) {
                case Weapons.GUN:
                    // make sound
                    this.scene.sound.play('shoot_temp');
                    BulletMan.addBullet("syringe", pc, this.angle);
                    // spawn muzzle flash
                    this.shoot = false; // 1 bullet per click
                    // subtract ammo.
                default:
            }
            
        }
        Phaser.Math.RotateTo(this.a1, pc.x, pc.y, this.angle-0.7854, this.r);
        Phaser.Math.RotateTo(this.a2, pc.x, pc.y, this.angle+0.7854, this.r);
    }
    
    
    keydown() {
        const A = this.keys.A.isDown || this.keys.LEFT.isDown;
        const D = this.keys.D.isDown || this.keys.RIGHT.isDown;
        const W = this.keys.W.isDown || this.keys.UP.isDown;
        const S = this.keys.S.isDown || this.keys.DOWN.isDown;
        
        if(A && !D)
            this.body.velocity.x -= this.max_velocity;
        else if(D && !A)
            this.body.velocity.x += this.max_velocity;
        else if(A && D)
            this.body.velocity.x = 0;
        
        if(W && !S)
            this.body.velocity.y -= this.max_velocity;
        else if(S && !W)
            this.body.velocity.y += this.max_velocity;
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


    SetWeapon(weapon, ammo) {
        if(weapon == this.weapon) {
            this.ammo += ammo;
        } else {
            this.weapon = weapon;
            this.ammo = ammo;
        }
    }
    
    
};

Phaser.GameObjects.GameObjectFactory.register('player', function (x, y, r) {
	const pl1 = new Player(this.scene, x, y, r);
    this.displayList.add(pl1);
    this.updateList.add(pl1);
    return pl1;
});