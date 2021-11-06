// import Phaser from 'phaser'
import { CircleInRectX, CircleInRectY } from './Bounds.js'


////////////////////////////////////////////////////////////////////////////////
// V2 : main dif is using physics engine also try w & d at same time & let go of one
////////////////////////////////////////////////////////////////////////////////

// default
export class Player1 extends Phaser.GameObjects.Sprite // .Sprite, .Image
{
    angle = 0;
    body;
    a1; a2;
    pressedKeys = {};
    
    constructor(scene, x, y, r) {
        // If we had more than 1 local player would need to move texture gen
        var circ = scene.make.graphics().fillStyle(0x6666ff).fillCircle(r, r, r);   // x, y, radius
        circ.generateTexture('PlayerBody', r*2, r*2);                               // width, height
        super(scene, x, y, 'PlayerBody');
        circ.destroy();

        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        scene.add.existing(this);
        
        // this.body.x = x+r;
        // this.body.y = y+r;
        // Turn this into a texture. And maybe create different poses such as holding weapon pose
        this.a1 = scene.add.circle(x+r, y, r*0.25, 0x808080);
        this.a1.setStrokeStyle(2, 0x000000);
        this.a2 = scene.add.circle(x, y+r, r*0.25, 0x808080);
        this.a2.setStrokeStyle(2, 0x000000);
        
        this.angle = 0;
        this.r = r;
        this.max_velocity = 10;

        document.addEventListener("keydown", this);
        document.addEventListener("keyup", this);
        this.scene.events.on('update', (time, delta) => { this.update(time, delta) }); // maybe keep the update call in the parent update call.
    }
    
    // To do: add colliders or sintgubg
    update(time, deltaTime) {
    // why so slow w/preUpdate? // physics velocity set wrong?
    // preUpdate(time, deltaTime) {
        // super.preUpdate(time, deltaTime);
        this.body.x += this.body.velocity.x;
        this.body.y += this.body.velocity.y;
        //------------------------------
        Phaser.Math.RotateTo(this.a1, this.body.x+this.r, this.body.y+this.r, this.angle-0.7854, this.r);
        Phaser.Math.RotateTo(this.a2, this.body.x+this.r, this.body.y+this.r, this.angle+0.7854, this.r);
    }
    
    handleEvent(e) {
        // e.preventDefault(); // no other capture this
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
                case 37:    this.body.velocity.x = 0; break;
                case 87:    // up
                case 38:    this.body.velocity.y = 0; break;
                case 68:    // right
                case 39:    this.body.velocity.x = 0; break;
                case 83:    // down
                case 40:    this.body.velocity.y = 0; break;
            };
        }
    }
    
    setAngleFrom(x, y) {
        this.angle = Phaser.Math.Angle.Between(
            this.body.x, this.body.y, 
            x, y
        );
    }
};

// another way to rotate around center
// orb = game.add.sprite(400, 300, 'ball');
// orb.anchor.setTo(0.5);
// orb.pivot.x = 100;
// body.rotation = 
// https://phaser.io/examples/v2/sprites/rotate-sprite-around-point
Phaser.GameObjects.GameObjectFactory.register('player', function (x, y, r) {
	const pl1 = new Player1(this.scene, x, y, r);
    this.displayList.add(pl1);
    this.updateList.add(pl1);
    return pl1;
});

////////////////////////////////////////////////////////////////////////////////
// V1
////////////////////////////////////////////////////////////////////////////////
export class Entity 
{
    
    //x; y;       // maybe remove
    vx; vy;
    scene;
    
    constructor(x, y, scene) {
        // this.x = x;
        // this.y = y;
        this.scene = scene;
    }
    
    update() {} 

};

// it would be a lot easier to do sprites & sprite groups but I refuse!
// dang we could probably just due 2d ray-tracing. that would be cool. 
// Entity is almost useless now.
export class Player extends Entity 
{
    angle = 0;
    vx = 0; vy = 0;
    max_velocity = 10;
    body; a1; a2;
    pressedKeys = {};
    
    
    constructor(x, y, r, scene) {
        super(x, y, scene);
        this.body = scene.add.circle(x, y, r, 0x6666ff);
        this.a1 = scene.add.circle(x+r, y, r*0.25, 0x808080);
        this.a1.setStrokeStyle(2, 0x000000);
        this.a2 = scene.add.circle(x, y+r, r*0.25, 0x808080);
        this.a2.setStrokeStyle(2, 0x000000);
        document.addEventListener("keydown", this);
        document.addEventListener("keyup", this);
    }  
  
    update() {
        // check world collision then move.
        const rect = {
            x: this.scene.physics.world.bounds.x, 
            y: this.scene.physics.world.bounds.y, 
            w: this.scene.physics.world.bounds.width, 
            h: this.scene.physics.world.bounds.height
        };
        var circ = {
            x: this.body.x + this.vx,
            y: this.body.y + this.vy,
            radius: this.body.radius
        };
        if(CircleInRectX(circ, rect))
            this.body.x = circ.x;
        if(CircleInRectY(circ, rect))
            this.body.y = circ.y;
        //------------------------------
        Phaser.Math.RotateTo(this.a1, this.body.x, this.body.y, this.angle-0.7854, this.body.radius);
        Phaser.Math.RotateTo(this.a2, this.body.x, this.body.y, this.angle+0.7854, this.body.radius);
    }
    
    setCamera() {}

    // There are methods provided by phaser but none that let you handle events in class.
    handleEvent(e) {
        // e.preventDefault(); // no other capture this
        if(e.type == 'keydown' && this.pressedKeys[e.keyCode] != true) {
            this.pressedKeys[e.keyCode] = true;
            switch(e.keyCode) {
                case 65:    // left
                case 37:    this.vx -= this.max_velocity; break;
                case 87:    // up
                case 38:    this.vy -= this.max_velocity; break;
                case 68:    // right
                case 39:    this.vx += this.max_velocity; break;
                case 83:    // down
                case 40:    this.vy += this.max_velocity; break;
            };
        }
        else if(e.type == 'keyup') {
            this.pressedKeys[e.keyCode] = false;
            switch(e.keyCode) {
                case 65:    // left
                case 37:    this.vx += this.max_velocity; break;
                case 87:    // up
                case 38:    this.vy += this.max_velocity; break;
                case 68:    // right
                case 39:    this.vx -= this.max_velocity; break;
                case 83:    // down
                case 40:    this.vy -= this.max_velocity; break;
            };
        }
    }
    
    setOrigin(x, y) {
        // translate to world coordinates
    }
    
    setAngleFrom(x, y) {
        this.angle = Phaser.Math.Angle.Between(
            this.body.x, this.body.y, 
            x, y
        );
    }
    
    
    get x() { return this.body.x; }
    get y() { return this.body.y; }
    
    
};

