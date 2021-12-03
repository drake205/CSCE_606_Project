import { Player } from './Player.js';
import { BulletMan } from "./BulletMan.js";
import { EntityMan } from "./EntityMan.js";
import { ItemMan } from "./Items.js";
import { Debug } from "./Debug.js";



const SCALE = 1.6;
const WIDTH = 1280*SCALE;
const HEIGHT = 720*SCALE;

let clientWidth = document.documentElement.clientWidth
let clientHeight = document.documentElement.clientHeight



class Game extends Phaser.Scene {

    static cameras;
    static light;
    static music;


    constructor(config) {
        super(config);
    }


    init(data) {}


    preload() {
        this.load.image({
            key: 'chain',
            url: 'data/gfx/chaingun.png'
        });
        this.load.image({
            key: 'chainicon',
            url: 'data/gfx/chaingunIcon.svg'
        });
        this.load.image({
            key: 'chainAmmo',
            url: 'data/gfx/chainAmmo.png'
        });

        this.load.image({
            key: 'shotgun',
            url: 'data/gfx/shotgun.svg'
        });
        this.load.image({
            key: 'shotgunicon',
            url: 'data/gfx/shotgunIcon.svg'
        });
        this.load.image({
            key: 'shotgunAmmo',
            url: 'data/gfx/shotgunAmmo.svg'
        });
        
        this.load.image({
            key: 'slingshot',
            url: 'data/gfx/slingshot.svg'
        });
        this.load.image({
            key: 'slingshoticon',
            url: 'data/gfx/slingshotIcon.svg'
        });
        this.load.image({
            key: 'slingAmmo',
            url: 'data/gfx/slingshotAmmo.svg'
        });
        
        
        this.load.image({
            key: 'background',
            // url: 'data/gfx/backgroundLab.jpg',
            url: 'data/gfx/Back4.svg',
            // url: 'data/gfx/background_lab01.jpg',
            // url: 'data/gfx/brickwall.jpg',
            normalMap: 'data/gfx/Back4Norm3.svg'
            // normalMap: 'data/gfx/brickwall_normal.jpg'
        });
        //-----------------------------------
        this.load.audio('game_music', 'data/sfx/music.wav');
        this.load.audio('shoot_pop', 'data/sfx/cork_edit.mp3');
        this.load.audio('shoot_twang', 'data/sfx/shoot.ogg');
        this.load.audio('shoot_bang', 'data/sfx/hit_3.wav');
        this.load.audio('death1', 'data/sfx/blub_hurt1.wav');
        this.load.audio('death2', 'data/sfx/blub_hurt2.wav');
        //-----------------------------------
        this.load.text('CovidRed', 'data/fx/CovidRed.frag');
        this.load.text('CovidGreen', 'data/fx/CovidGreen.frag');
        this.load.text('CovidBlue', 'data/fx/CovidBlue.frag');
        this.load.text('CovidVert', 'data/fx/Covid.vert');
    }


    create(data) {
        // change shader to spritesheet. 
         this.add.shader(
            new Phaser.Display.BaseShader('---', this.cache.text.get('CovidGreen'), this.cache.text.get('CovidVert')), 
            0, 0, 300, 300, []
        ).setRenderToTexture('virus_green');
       this.add.shader(
            new Phaser.Display.BaseShader('----', this.cache.text.get('CovidRed'), this.cache.text.get('CovidVert')),
            0, 0, 500, 500, []
        ).setRenderToTexture('virus_red');
        this.add.shader(
            new Phaser.Display.BaseShader('------', this.cache.text.get('CovidBlue'), this.cache.text.get('CovidVert')),
            0, 0, 200, 200, []
        ).setRenderToTexture('virus_blue');
        
        this.physics.world.setBounds(0, 0, WIDTH*2, HEIGHT*2);
        // this.cameras.main.zoom = 1.5;
        this.cameras.main.setBounds(0, 0, WIDTH*2, HEIGHT*2);

        // this.cameras.main.x = 0 // camera position on canvas
        // this.cameras.main.y = 0;
        this.add.image(0, 0, 'background')
            .setPipeline('Light2D')
            .setOrigin(0, 0)
            .setDisplaySize(WIDTH*2, HEIGHT*2);
            
        this.lights.enable().setAmbientColor(0x555555);
        Game.light  = this.lights.addLight(0, 0, 200);
        
        EntityMan.Init(this);
        ItemMan.Init(this);
        BulletMan.Init(this);
        Debug.Init(this);
        
        this.music = this.sound.add('game_music', {loop: true, volume: 0.2});
        this.music.play();

        this.input.setDefaultCursor('crosshair');
    }


    update(time, delta) {
        this.cameras.main.startFollow(EntityMan.player);
        let pointer = this.input.mousePointer;
        const wp = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        pointer.worldX = wp.x;
        pointer.worldY = wp.y;
        
        EntityMan.Update(time, delta);
        BulletMan.Update(time, delta);
        let pc = EntityMan.player.getCenter();
        Game.light.setPosition(pc.x, pc.y);
        Debug.update(time, delta);
    }
}



class UIScene extends Phaser.Scene {

    score;
    ammoText;
    scoreText;
    
    constructor(config) {
        super({ key: 'UIScene', active: true });
    }

    create(data)
    {
        this.score = 0;
        this.scoreText = this.add.text(10, 50, 'Score: 0', { fill: '#0f0' });
        this.ammoText = this.add.text(10, 80, 'Ammo: ∞', { fill: '#0f0' });
        
        
        var ourGame = this.scene.get('default');

        ourGame.events.on('addScore', function (value) {
            this.score += value;
            this.scoreText.setText('Score: ' + this.score);
        }, this);
        
        ourGame.events.on('ammoChange', function (value) {
            if(value <= 0) value = '∞';
            this.ammoText.setText('Ammo: ' + value);
        }, this);
    }

};









// create a webgl1 & then a webgl1 and webgl experimental fallback
const myCustomCanvas = document.createElement('canvas');
document.body.appendChild(myCustomCanvas);
const contextCreationConfig = {
    alpha: true,
    depth: false,
    // antialias: true,
    // premultipliedAlpha: true,
    // stencil: true,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'default'
};

const myCustomContext = myCustomCanvas.getContext('webgl2', contextCreationConfig);


// type: Phaser.AUTO,
const gameConfig = {
    type: Phaser.WEBGL,
    canvas: myCustomCanvas,
    context: myCustomContext,
    maxLights: 10,
    width: clientWidth,
    height: clientHeight,
    // antialias: false,
    // premultipliedAlpha: false,
    mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
    roundPixels: true,
    mode: Phaser.Scale.FIT,
    "callbacks.postBoot": function() {
        document.getElementsByTagName("canvas")[0].style.width = clientWidth + "px";
        document.getElementsByTagName("canvas")[0].style.height = clientHeight + "px";
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,            // lights only work in debug mode?
            debugShowBody: false,   // yo Keep this off. I moved velocity to body also. Velocity now draws 1 pixel that somehow fixes broken lights
            debugShowVelocity: true // and keep this ON.
        }
    },
    // renderer: { mipmapFilter: 'LINEAR_MIPMAP_LINEAR' },
    // renderer: { mipmapFilter: 'NEAREST_MIPMAP_LINEAR' },
    // render: {
    //     roundPixels: true,
    // },
    scene: [Game, UIScene]
 };
var game = new Phaser.Game(gameConfig);