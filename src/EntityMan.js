import { Player } from './Player.js';
import { Enemy, Enemies } from "./Enemies.js"
import { TossCoin } from './Math.js'

export class EntityMan {
    
    static player;
    static enemies;
    static scene;
    
    static Init(scene) {
        EntityMan.scene = scene;
        EntityMan.player = scene.add.player(scene.physics.world.bounds.centerX, scene.physics.world.bounds.centerY, 40).setOrigin(0.5, 0.5);
        
        EntityMan.enemies = scene.add.group({
			classType: Enemy,
			runChildUpdate: true,
			removeCallback: function(enemy) {}
		});
		for(let i = 0; i < 5; ++i) { // will be removed later
		    EntityMan.SpawnEnemy(Enemies.GREEN);
		  //  EntityMan.SpawnEnemy(TossCoin(0.8) ? Enemies.GREEN : (TossCoin(0.7) ? Enemies.BLUE : Enemies.RED));
		}
		EntityMan.SpawnEnemy(Enemies.RED);
        EntityMan.SpawnEnemy(Enemies.BLUE);
        EntityMan.SpawnEnemy(Enemies.BLUE);
        // dont need to refresh i think.
    }
    
    static Update(time, delta) {
        EntityMan.player.update(time, delta);
        
        
    }
    
    static SpawnEnemy(type) {
        let spawnloc = Enemy.SpawnLoc(EntityMan.scene); // maybe just pass scene in
        let e;
        switch(type) {
            case Enemies.GREEN:
        	    e = EntityMan.enemies.get(spawnloc.x, spawnloc.y, 'virus_green');
        	    break;
            case Enemies.RED:
                e = EntityMan.enemies.get(spawnloc.x, spawnloc.y, 'virus_red');
        	    e.hp = 2;
        	    break;
        	case Enemies.BLUE:
                e = EntityMan.enemies.get(spawnloc.x, spawnloc.y, 'virus_blue');
        	    e.hp = 3;
        	    break;
        };
        e.type = type;
        e.setTarget(this.player); // maybe move to create callback
	    e.setPipeline('Light2D');
    }


};