import { Player } from './Player.js';
import { BulletMan } from "./BulletMan.js"
import { EntityMan } from "./EntityMan.js"


const SCALE = 1.6;
const WIDTH = 1280*SCALE;
const HEIGHT = 720*SCALE;


class Game extends Phaser.Scene {
    
    static cameras;
    static light;
    
    constructor(config) {
        super(config);
    }

    init(data) {
        // initialize different sections here
        
    }
    
    preload() {
        // load content
        this.load.image({
            key: 'syringe', 
            url: 'data/pics/syringe.png'
        });
        this.load.image({
            key: 'reticle', 
            url: 'data/pics/reticle2.png'
        });
        this.load.image({
            key: 'covid1', 
            url: 'data/pics/covid1.png'
        });
        this.load.image({
            key: 'covid2', 
            url: 'data/pics/covid2.png',
            normalMap: 'data/pics/Covid2NM.png'
        });
        this.load.image({
            key: 'background', 
            url: 'data/pics/brickwall.jpg',
            normalMap: 'data/pics/brickwall_normal.jpg'
        });
    }
    
    create(data) {
        this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);                                     // Create world bounds
        this.cameras.main.zoom = 0.7;
        this.cameras.main.setBounds(0, 0, WIDTH, HEIGHT);
        // if camera intersects world bounds setDeadZone(width height) else if deadZoneSet setDeadZone() 
        /*---------------------- Create Objects ------------------------------*/
        this.add.image(WIDTH/2, HEIGHT/2, 'background')
            .setPipeline('Light2D')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(WIDTH, HEIGHT);
        EntityMan.Init(this);
        BulletMan.Init(this);
        Game.light  = this.lights.addLight(0, 0, 200);
        this.lights.enable().setAmbientColor(0x555555);

        game.canvas.addEventListener('mousedown', function () {                             // Mouse stuck inside game
            game.input.mouse.requestPointerLock();
        });
        this.input.on('pointermove', function(pointer) {                                   // Move reticle upon locked pointer move
            if(this.input.mouse.locked) {
                Player.reticle.x += pointer.movementX;
                Player.reticle.y += pointer.movementY;
            }
        }, this);
    }
    
    update(time, delta) {
        this.cameras.main.startFollow(EntityMan.player);
        EntityMan.Update(time, delta);
        BulletMan.Update(time, delta);
        Game.light.setPosition(Player.body.x, Player.body.y);     // make light follow bound reticle
        // this.cameras.main.startFollow(Player.reticle);
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
    scene: Game
};
var game = new Phaser.Game(config);
