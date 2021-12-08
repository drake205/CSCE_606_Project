import { Player } from './Player.js';
import { Enemy, Enemies } from "./Enemies.js";
import { TossCoin } from './Math.js';
import { ItemMan, Item, Items } from './Items.js';



export class EntityMan {
    
    static player;
    static enemies;
    static scene;
    
    static nextEvent;
    static delayTemp;
    
    static Init(scene) {
        EntityMan.scene = scene;
        EntityMan.player = scene.add.player(scene.physics.world.bounds.centerX, scene.physics.world.bounds.centerY, 40).setOrigin(0.5, 0.5);
        
        EntityMan.enemies = scene.add.group({
			classType: Enemy,
			runChildUpdate: true,
			removeCallback: function(enemy) {
			    if(TossCoin(0.5)) ItemMan.addItem(Item.RandomItem(), enemy.getCenter());
			}
		});
		for(let i = 0; i < 5; ++i) { // will be removed later
		    EntityMan.SpawnEnemy(Enemies.GREEN);
		  //  EntityMan.SpawnEnemy(TossCoin(0.8) ? Enemies.GREEN : (TossCoin(0.7) ? Enemies.BLUE : Enemies.RED));
		}
		EntityMan.SpawnEnemy(Enemies.RED);
        EntityMan.SpawnEnemy(Enemies.BLUE);
        EntityMan.SpawnEnemy(Enemies.BLUE);
        // dont need to refresh i think.
        //-------------------------------------------------------------
        EntityMan.items = scene.add.group({
            classType: Item,
            runChildUpdate: true
        });
        scene.physics.add.overlap(EntityMan.enemies, EntityMan.player, Player.DoDamage);
        EntityMan.nextEvent = 1000;
        EntityMan.delayTemp = 50;
        //-----------------------------------------------------
        
    }
    
    
    
    static Update(time, delta) {
        ++EntityMan.delayTemp;
        // EntityMan.timer += delta;
        // 
        
        EntityMan.player.update(time, delta);
        //-------------------------------------------
        // Every 10 secs spawn some green enemies.
        // then at certain times spawn some special guys
        //-------------------------------------------
        if(EntityMan.player.score > EntityMan.nextEvent) { //Phaser.Core.TimeStep.getDuration()
        // if(time/1000 % 10)
        // if(time/1000 > EntityMan.nextEvent) {
            // console.log(time/1000);
            EntityMan.scene.events.emit('nextEvent');
            switch(EntityMan.nextEvent) {
                case 1000:  
                    for(let i = 0; i < 5; ++i)
		                EntityMan.SpawnEnemy(Enemies.GREEN);
                    break;
                case 2000:
                case 4000:
                    for(let i = 0; i < 3; ++i)
		                EntityMan.SpawnEnemy(Enemies.GREEN);
                    EntityMan.SpawnEnemy(Enemies.BLUE);
                    break;
                case 8000:  
                    EntityMan.SpawnEnemy(Enemies.BLUE);
                    EntityMan.SpawnEnemy(Enemies.BLUE);
                    EntityMan.SpawnEnemy(Enemies.RED);
                    break;
                case 16000:  
                    for(let i = 0; i < 5; ++i) {
		                EntityMan.SpawnEnemy(Enemies.GREEN);
                        EntityMan.SpawnEnemy(Enemies.BLUE);
                        EntityMan.SpawnEnemy(Enemies.RED);
                    }
                    break;
                default:
                    for(let i = 0; i < 5; ++i) {
                        EntityMan.SpawnEnemy(Enemies.GREEN);
                        EntityMan.SpawnEnemy(Enemies.BLUE);
                    }
                    EntityMan.SpawnEnemy(Enemies.RED);
                    EntityMan.SpawnEnemy(Enemies.RED);
                    break;
            };
            
            EntityMan.nextEvent *= 2;
            
        }
        
        
    }
    
    static SpawnEnemy(type) {
        let spawnloc = Enemy.SpawnLoc(EntityMan.scene); // maybe just pass scene in
        let e;
        switch(type) {
            case Enemies.GREEN:
        	    e = EntityMan.enemies.get(spawnloc.x, spawnloc.y, type);        // in here as there could be enemy specific spawning later.
        	    break;
            case Enemies.RED:
                e = EntityMan.enemies.get(spawnloc.x, spawnloc.y, type);
        	    e.hp = 2;
        	    break;
        	case Enemies.BLUE:
                e = EntityMan.enemies.get(spawnloc.x, spawnloc.y, type);
        	    e.hp = 3;
        	    break;
        };
        e.type = type;
        e.setTarget(this.player); // maybe move to create callback
	    e.setPipeline('Light2D');
    }
    
    
    


};

function damagePlayer(Player1, Enemy1) {
     if(EntityMan.delayTemp < 50) { // change this to use delta time.
        return;
    } else EntityMan.delayTemp = 0;
    
    // let damageText = EntityMan.scene.add.text(Player1.x+10, Player1.y-20, "-10")
    //     .setFontSize(30).setFontFamily("Courier New").setOrigin(0.5).setColor('#FF0000');
    // EntityMan.scene.tweens.add({
    //     targets: damageText,
    //     alpha: 0,
    //     duration: 300,
    //     ease: 'Power2',
    //     onComplete: function() {
    //         damageText.destroy();  
    //     }
    // });
    
    // this.input.on('pointerdown', function (pointer) {

        

    // });
    
}