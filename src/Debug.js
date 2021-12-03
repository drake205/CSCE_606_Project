import { EntityMan } from "./EntityMan.js";
import { ItemMan, ItemIcons } from "./Items.js";


export class Debug 
{
    static scene;
    static wc;
    static wb;
    static pc;
    static cam;
    static mouse;
    
    static showEnemies;
    static spawnGunsText;

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

        // //---------------------------------- ,
        Debug.txt = scene.add.text(0, 0, '', style);
        //------------------------------------------
        Debug.showEnemies = true;
        this.clickButton = scene.add.text(0, 0, 
            'ToggleEnemies:'+JSON.stringify(Debug.showEnemies), 
            { fill: '#0f0' }
        ).setInteractive()
         .on('pointerdown', () => Debug.updateClickCountText(Debug.showEnemies ^= 1) );
    
        this.updateClickCountText(this.showEnemies ^= 1);
        
        this.spawnGunsText = scene.add.text(0, 0, 
            'Spawn Guns', 
            { fill: '#0f0' }
        ).setInteractive()
         .on('pointerdown', () => Debug.spawnGuns() );
    }

    static updateClickCountText(showEnemies) {
        EntityMan.enemies.children.each(child => {
            child.setActive(showEnemies).setVisible(showEnemies);//.disableInteractive();
            child.body.enable = showEnemies;
         });
    }
    
    static spawnGuns() {
        ItemMan.addItem(ItemIcons.CHAIN, {x: EntityMan.player.x, y: EntityMan.player.y+100 });
        ItemMan.addItem(ItemIcons.SHOTGUN, {x: EntityMan.player.x-100, y: EntityMan.player.y });    
        ItemMan.addItem(ItemIcons.SLINGSHOT, {x: EntityMan.player.x+100, y: EntityMan.player.y  });
    }


    static update(t, dt) {
        const cam_tl = Debug.scene.cameras.main.worldView;
        this.clickButton.setText('ToggleEnemies: '+JSON.stringify(Debug.showEnemies)).setPosition(cam_tl.x+5, cam_tl.y+5);
        this.spawnGunsText.setText('Spawn Guns').setPosition(cam_tl.x+300, cam_tl.y+5);
        Debug.txt.setText(
            // "WorldCenter: " + JSON.stringify(Debug.wc) + '\n' +
            // "WorldBounds: " + JSON.stringify(Debug.wb) + '\n' +
            "PlayerCenter: " + JSON.stringify(Debug.pc)  + '\n\n' +
            // "CamInfo: " + JSON.stringify(Debug.cam, null, '\t') + '\n\n' +
            // "MouseMid: " + JSON.stringify(Debug.mouse.midPoint) + '\n' +
            "MouseWPos: " + JSON.stringify({x: Debug.mouse.worldX, y: Debug.mouse.worldY}) + '\n' +
            "MousePos: " + JSON.stringify(Debug.mouse.position) + '\n' +
            // "MousePrev: " + JSON.stringify(Debug.mouse.prevPosition) + '\n' +
            "MouseMove: " + JSON.stringify(Debug.mouse.movementX) + '\n'
            // "MouseDelt: " + JSON.stringify(Debug.mouse.deltaX) + '\n'
            // "MouseDelt1: " + JSON.stringify(Debug.mouse) + '\n'
        ).setPosition(cam_tl.x+5, cam_tl.y+300);
    }
}
