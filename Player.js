import { CircleInRectX, CircleInRectY } from './Bounds.js'
import { constrainReticle } from './Bounds.js';


const Weapons = Object.freeze({
    GUN:   Symbol("weapon")
});



export class Player extends Phaser.GameObjects.Sprite
{
    static reticle;
    static body;
    angle = 0;
    #a1; #a2;
    pressedKeys = {};
    #weapon; #ammo
    shoot;

    // move to create?
    constructor(scene, x, y, r) {
        let circ = scene.make.graphics()
            .fillStyle(0x6666ff)
            .fillCircle(r, r, r)   // x, y, radius
            .generateTexture('PlayerBody', r*2, r*2);                               // width, height
        super(scene, x, y, 'PlayerBody');
        circ.destroy();

        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        scene.add.existing(this);
        Player.reticle = scene.physics.add.sprite(x+r*4, y, 'reticle');      
        Player.reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(false);    // recticle world origin
        Player.body = this.body
        // Turn this into a texture. And maybe create different poses such as holding weapon pose
        this.a1 = scene.add.circle(x+r, y, r*0.25, 0x808080);
        this.a1.setStrokeStyle(2, 0x000000);
        this.a2 = scene.add.circle(x, y+r, r*0.25, 0x808080);
        this.a2.setStrokeStyle(2, 0x000000);
        
        this.angle = 0;
        this.r = r;
        this.body.setMaxVelocity(300, 300);
        this.max_velocity = 300;
        this.shoot = false;

        document.addEventListener("keydown", this);
        document.addEventListener("keyup", this);
        document.addEventListener("mousedown", this);
    }

    
    preUpdate(time, deltaTime) {
        super.preUpdate(time, deltaTime);
        this.angle = Phaser.Math.Angle.Between(
            this.body.x, this.body.y, 
            Player.reticle.x, Player.reticle.y
        );
        
    }

    
    // To do: add colliders or something
    update(time, deltaTime) {
        if(this.shoot) {
            switch(this.weapon) {
                case Weapons.GUN:
                    // make sound
                    // spawn x bullet
                    // spawn muzzle flash
                    
                default:
            }
        }
        
        Phaser.Math.RotateTo(this.a1, this.body.x+this.r, this.body.y+this.r, this.angle-0.7854, this.r);
        Phaser.Math.RotateTo(this.a2, this.body.x+this.r, this.body.y+this.r, this.angle+0.7854, this.r);
        Player.reticle.setVelocity(this.body.velocity.x, this.body.velocity.y);
    }
    
    
    handleEvent(e) {
        e.preventDefault(); // no other capture this
        if(e.type == 'keydown' && this.pressedKeys[e.keyCode] != true) {
            this.pressedKeys[e.keyCode] = true;
            switch(e.keyCode) {
                case 65:    // left
                case 37:    this.body.velocity.x -= this.max_velocity; break;
                case 87:    // up
                case 38:    this.body.velocity.y -= this.max_velocity; break;
                case 68:    // right
                case 39:    this.body.velocity.x += this.max_velocity; break;
                case 83:    // down
                case 40:    this.body.velocity.y += this.max_velocity; break;
            };
        }
        else if(e.type == 'keyup') {
            this.pressedKeys[e.keyCode] = false;
            switch(e.keyCode) {
                case 65:    // left
                case 37:    this.body.velocity.x += this.max_velocity; break;
                case 87:    // up
                case 38:    this.body.velocity.y += this.max_velocity; break;
                case 68:    // right
                case 39:    this.body.velocity.x -= this.max_velocity; break;
                case 83:    // down
                case 40:    this.body.velocity.y -= this.max_velocity; break;
            };
        }
        else if(e.type == 'mousedown') {
            this.shoot = true;
        } else if(e.type == 'mouseup') {
            this.shoot = false;
        }
        
    }


    SetWeapon(weapon, ammo) {
        if(weapon == this.weapon) {
            this.ammo += ammo;
        } else {
            this.weapon = weapon;
            this.ammo = ammo;
        }
    }
    
};

//{ another way to rotate around center
// orb = game.add.sprite(400, 300, 'ball');
// orb.anchor.setTo(0.5);
// orb.pivot.x = 100;
// body.rotation = 
// https://phaser.io/examples/v2/sprites/rotate-sprite-around-point}
Phaser.GameObjects.GameObjectFactory.register('player', function (x, y, r) {
	const pl1 = new Player(this.scene, x, y, r);
    this.displayList.add(pl1);
    this.updateList.add(pl1);
    return pl1;
});
