import { Player } from './Player.js';
import { Enemy, Enemies } from "./Enemies.js";
import { TossCoin } from './Math.js';
import { ItemMan, Item } from './Items.js';



export class EntityMan {
    
    static player;
    static enemies;
    static scene;
    
    static nextScoreEvent;
    static prevEnemyCount;
    static timer;
    static score2win = 95000;
    
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
		EntityMan.items = scene.add.group({
            classType: Item,
            runChildUpdate: true
        });
        
		for(let i = 0; i < 5; ++i)
		    EntityMan.SpawnEnemy(Enemies.GREEN);
		EntityMan.SpawnEnemy(Enemies.RED);
        EntityMan.SpawnEnemy(Enemies.BLUE);
        EntityMan.SpawnEnemy(Enemies.BLUE);
        // dont need to refresh
        //-------------------------------------------------------------
        
        scene.physics.add.overlap(EntityMan.enemies, EntityMan.player, Player.DoDamage);
        
        //-----------------------------------------------------
        EntityMan.nextScoreEvent = 1000;
        EntityMan.prevEnemyCount = EntityMan.enemies.countActive();
        EntityMan.timer = 0;
        
        
    }
    
    
    
    static Update(time, dt) {
        EntityMan.player.update(time, dt);
        EntityMan.timer += dt;
        while(EntityMan.timer > 10000) {    // spawn enemy every 10 seconds.
            EntityMan.SpawnEnemy(Enemies.GREEN);
            this.timer -= 10000;
        }
        
        // if score or enemies equals the required enemy count move to next event
        if(EntityMan.player.score > EntityMan.nextScoreEvent || EntityMan.enemies.countActive() >= 3*EntityMan.prevEnemyCount) { 
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
            }
            EntityMan.nextScoreEvent *= 2;
            EntityMan.prevEnemyCount = EntityMan.enemies.countActive();
        }
        
        if(EntityMan.player.score >= EntityMan.score2win) {
            // start game win event
            EntityMan.scene.events.emit('gamewin');
            // no more spawns allows
            EntityMan.timer = 0;
            // "you win" swoops in.
            // not implemented
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
        }
        e.type = type;
        e.setTarget(this.player); // maybe move to create callback
	    e.setPipeline('Light2D');
    }


}
