import { Player } from './Player.js';
import { BulletMan } from "./BulletMan.js";
import { EntityMan } from "./EntityMan.js";

class Debug {
    static scene;
    static wc;
    static wb;
    static pc;
    static cam;
    static mouse;
  

    static txt;

    static Init(scene) {
        Debug.scene = scene;
        Debug.wc = {x: EntityMan.scene.physics.world.bounds.centerX, y: EntityMan.scene.physics.world.bounds.centerY };
        Debug.wb = {x: EntityMan.scene.physics.world.bounds.width, y: EntityMan.scene.physics.world.bounds.height };
        Debug.pc = EntityMan.player.body.center;
        Debug.cam = scene.cameras.main;
        Debug.mouse = scene.game.input.activePointer;
        // wordWrap: { callback: wordWrap }
        // wordWrap: { width: 10 }
        var style = { font: 'bold 8pt Arial', fill: 'white'};

        //---------------------------------- ,
        Debug.txt = scene.add.text(30, 30, '', style);
    }


    static update(t, dt) {
        const cam_tl = Debug.scene.cameras.main.worldView;
        Debug.txt.setText(
            "WorldCenter: " + JSON.stringify(Debug.wc) + '\n' +
            "WorldBounds: " + JSON.stringify(Debug.wb) + '\n' +
            "PlayerCenter: " + JSON.stringify(Debug.pc)  + '\n\n' +
            "CamInfo: " + JSON.stringify(Debug.cam, null, '\t') + '\n\n' +
            "MouseMid: " + JSON.stringify(Debug.mouse.midPoint) + '\n' +
            "MouseWPos: " + JSON.stringify({x: Debug.mouse.worldX, y: Debug.mouse.worldY}) + '\n' +
            "MousePos: " + JSON.stringify(Debug.mouse.position) + '\n' +
            "MousePrev: " + JSON.stringify(Debug.mouse.prevPosition) + '\n' +
            "MouseMove: " + JSON.stringify(Debug.mouse.movementX) + '\n' +
            "MouseDelt: " + JSON.stringify(Debug.mouse.deltaX) + '\n'
            // "MouseDelt1: " + JSON.stringify(Debug.mouse) + '\n'
        ).setPosition(cam_tl.x+5, cam_tl.y+5);
    }
}


const SCALE = 1.6;
const WIDTH = 1280*SCALE;
const HEIGHT = 720*SCALE;

let clientWidth = document.documentElement.clientWidth
let clientHeight = document.documentElement.clientHeight



class Game extends Phaser.Scene {

    static cameras;
    static light;
    static customPipeline;
    music;


    constructor(config) {
        super(config);
    }


    init(data) {}


    preload() {
        // load content
        this.load.image({
            key: 'syringe',
            url: 'data/gfx/syringe_crop.png'
        });
        this.load.image({
            key: 'background',
            url: 'data/gfx/brickwall.jpg',
            normalMap: 'data/gfx/brickwall_normal.jpg'
        });
        //-----------------------------------
        this.load.audio('song_temp', 'data/sfx/music.wav');
        this.load.audio('shoot_temp', 'data/sfx/cork_edit.mp3');
        this.load.audio('death1', 'data/sfx/blub_hurt1.wav');
        this.load.audio('death2', 'data/sfx/blub_hurt2.wav');
        //-----------------------------------
        this.load.text('CovidRed', 'data/fx/CovidRed.frag');
        this.load.text('CovidGreen', 'data/fx/CovidGreen.frag');
        this.load.text('CovidBlue', 'data/fx/CovidBlue.frag');
        this.load.text('CovidVert', 'data/fx/Covid.vert');
    }


    create(data) {
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
        
        
        this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);
        this.cameras.main.zoom = 1.5;
        this.cameras.main.setBounds(0, 0, WIDTH, HEIGHT);
        

        
        
        this.add.image(WIDTH/2, HEIGHT/2, 'background')
            .setPipeline('Light2D')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(WIDTH, HEIGHT);
        
    
        Game.light  = this.lights.addLight(0, 0, 200);
        this.lights.enable().setAmbientColor(0x555555);

        EntityMan.Init(this);
        BulletMan.Init(this);
        Debug.Init(this);

        this.music = this.sound.add('song_temp', {loop: true, volume: 0.2});
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
        // Debug.update(time, delta);
    }
}



// create a webgl1 & then a webgl1 and webgl experimental fallback
const myCustomCanvas = document.createElement('canvas');
document.body.appendChild(myCustomCanvas);
const contextCreationConfig = {
    alpha: true,
    depth: false,
    antialias: true,
    // premultipliedAlpha: true,
    // stencil: true,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'default'
};

const myCustomContext = myCustomCanvas.getContext('webgl2', contextCreationConfig);



const gameConfig = {
    // type: Phaser.AUTO,
    type: Phaser.WEBGL,
    canvas: myCustomCanvas,
    context: myCustomContext,
    
    width: clientWidth,
    height: clientHeight,
    antialias: true,
    // premultipliedAlpha: false,
    mode: Phaser.Scale.FIT,
    "callbacks.postBoot": function() {
        document.getElementsByTagName("canvas")[0].style.width = clientWidth + "px"
        document.getElementsByTagName("canvas")[0].style.height = clientHeight + "px"
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    render: {
        roundPixels: true,
    },
    scene: Game
 };
var game = new Phaser.Game(gameConfig);