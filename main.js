// import Phaser from './site/phaser.js'
import { constrainReticle } from './Bounds.js';
import { Player, Player1 } from './Player.js';
import { CovidCell } from "./Enemies.js"

//==============================================================================

class MainGame extends Phaser.Scene {
    
    player; reticle;
    
    constructor(config) {
        super(config);
    }

    init(data) {}
    
    preload() {
        this.load.image({
            key: 'covid1', 
            url: 'data/pics/covid1.png'
        });
        this.load.image({
            key: 'covid2', 
            url: 'data/pics/covid2.png'
        });
        this.load.image({
            key: 'background', 
            url: 'data/pics/brickwall.jpg',
            normalMap: 'data/pics/brickwall_normal.jpg'
        });
    }
    
    create(data) {
        /*---------------------- World Setup ---------------------------------*/
        this.physics.world.setBounds(0, 0, 1600, 1200);                                     // Create world bounds
        this.cameras.main.zoom = 0.5;                                                       // Set camera zoom
        /*---------------------- Create Objects ------------------------------*/
        var background = this.add.image(800, 600, 'background').setPipeline('Light2D');
        this.player = new Player(800, 600, 40, this);
        this.reticle = this.physics.add.sprite(800, 600, 'target');                              // in world coordinates?
        
        this.player1 = this.add.player(700, 600, 40);
        
        this.enemies = this.add.group({
			classType: CovidCell,
			runChildUpdate: true
		});
		for(let i = 0; i < 5; ++i) {
		    this.enemies.get(100*i, 100, 'covid2');
		}
        this.enemies.children.each(child => {
        	child.setTarget(this.player1)
        });
        
        /*---------------------- Properties ----------------------------------*/
        background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);                          // Set image/sprite properties
        this.reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(false);    // recticle world origin
        /*---------------------- Fx Create/Properties ------------------------*/
        /**
            * This light sucks. they only have like point lights. we need like a 
              spot/directional light
            * Would be Good idea for a glow effect or somthing though.
              
        **/
        this.light  = this.lights.addLight(0, 0, 200);
        this.lights.enable().setAmbientColor(0x555555);
        /*---------------------- Events --------------------------------------*/
        
        game.canvas.addEventListener('mousedown', function () {                             // Mouse stuck inside game
            game.input.mouse.requestPointerLock();
        });
        
        this.input.on('pointermove', function (pointer) {                                   // Move reticle upon locked pointer move
            if (this.input.mouse.locked) {
                this.reticle.x += pointer.movementX;
                this.reticle.y += pointer.movementY;
                //==========================================
                this.light.x = this.reticle.x;  // Yo if not move mouse and move character enought light doesnt follow reticle
                this.light.y = this.reticle.y;
            }
        }, this);
        
    }
    
    update(time, delta) {
        
        // Rotates player to face towards reticle. Move this to player class.
        this.player.setAngleFrom(this.reticle.x, this.reticle.y)
        this.player1.setAngleFrom(this.reticle.x, this.reticle.y)
        
        this.player.update();
        // this.player1.update(); // bound on update event in player1 class constructer. idk if this is the way to do it. preUpdate override makes velocity slow?
        
        // Camera follows reticle
        this.cameras.main.startFollow(this.reticle);

        this.reticle.setVelocity(this.player.vx, this.player.vy);
        constrainReticle(this.reticle, this.player, 550);           // bound to radius around player
        this.light.setPosition(this.reticle.x, this.reticle.y);     // make light follow bound reticle
        
    }
}


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
      default: 'arcade', // matter?
      arcade: {
        gravity: { y: 0 },
        debug: true
      }
    },
    scene: MainGame
    // scene: {
    //     preload: preload,
    //     create: create,
    //     update: update,
    //     extend: {
    //                 player: null,
    //                 reticle: null,
    //                 moveKeys: null,
    //                 bullets: null,
    //                 lastFired: 0,
    //                 time: 0,
    //             }
    // }
};
var game = new Phaser.Game(config);