import { EntityMan } from "./EntityMan.js";
import { ItemMan, ItemIcons } from "./Items.js";
import { Enemies } from "./Enemies.js";


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
    static invincible = false;

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
        
        this.spawnRedText = scene.add.text(0, 0, 
            'Spawn Red', 
            { fill: '#0f0' }
        ).setInteractive()
         .on('pointerdown', () => Debug.spawnEnemy(Enemies.RED) );
         
         
        this.spawnGreenText = scene.add.text(0, 0, 
            'Spawn Green', 
            { fill: '#0f0' }
        ).setInteractive()
         .on('pointerdown', () => Debug.spawnEnemy(Enemies.GREEN));
         
        this.spawnBlueText = scene.add.text(0, 0, 
            'Spawn Blue', 
            { fill: '#0f0' }
        ).setInteractive()
         .on('pointerdown', () => Debug.spawnEnemy(Enemies.BLUE) );
         
         this.invincibleText = scene.add.text(0, 0, 
            'invincible: off', 
            { fill: '#0f0' }
        ).setInteractive()
         .on('pointerdown', () => Debug.invincibleSet(Debug.showEnemies ^= 1) );
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

    static spawnEnemy(type) {
        let pc = EntityMan.player.body.center;
        console.log(pc);
        let e = EntityMan.enemies.get(pc.x+200, pc.y, type);
        e.type = type;
        e.setTarget(EntityMan.player); 
	    e.setPipeline('Light2D');
	    
	    switch(type) {
            case Enemies.GREEN:
        	   break;
            case Enemies.RED:
        	    e.hp = 2;
        	    break;
        	case Enemies.BLUE:
        	    e.hp = 3;
        	    break;
        };
    }
    
    static invincibleSet(state) {
        // Debug.invincible
        if(state)
            EntityMan.player.health = 1e6;
        else
            EntityMan.player.health = 3;
    } 

    static update(t, dt) {
        // Debug.updateClickCountText(Debug.showEnemies);
        const cam_tl = Debug.scene.cameras.main.worldView;
        this.clickButton.setText('ToggleEnemies: '+JSON.stringify(Debug.showEnemies)).setPosition(cam_tl.x+5, cam_tl.y+5);
        this.spawnGunsText.setText('Spawn Guns').setPosition(cam_tl.x+300, cam_tl.y+5);
        this.spawnBlueText.setText('Spawn Blue').setPosition(cam_tl.x+300, cam_tl.y+50);
        this.spawnGreenText.setText('Spawn Green').setPosition(cam_tl.x+300, cam_tl.y+100);
        this.spawnRedText.setText('Spawn Red').setPosition(cam_tl.x+300, cam_tl.y+150);
        this.invincibleText.setText('inf-lives: '+Debug.invincible).setPosition(cam_tl.x+300, cam_tl.y+180);
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
