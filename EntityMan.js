import { Player } from './Player.js';
import { Enemy } from "./Enemies.js"
export class EntityMan {
    
    static player;
    static enemies;
    static scene;

    
    static Init(scene) {
        EntityMan.scene = scene;
        EntityMan.player = scene.add.player(700, 600, 40);
        EntityMan.enemies = scene.add.group({
			classType: Enemy,
			runChildUpdate: true
		});
		for(let i = 0; i < 5; ++i) { // will be removed later
		    let spawnloc = Enemy.SpawnLoc(scene);
		    EntityMan.enemies.get(spawnloc.x, spawnloc.y, 'covid2');
		}
		this.enemies.children.each(child => {
        	child.setTarget(this.player);
        	child.setPipeline('Light2D');
        	
        	let light = scene.lights.addLight(0, 0, 60);
        	light.color.set(1, 0.2, 0.2);
        	child.glow = light;
        });
        // dont need to refresh i think
    }
    
    static Update(time, delta) {
        EntityMan.player.update(time, delta);
    }
    
    static SpawnEnemy() {
        let spawnloc = Enemy.SpawnLoc(EntityMan.scene); // maybe just pass scene in
	    EntityMan.enemies.get(spawnloc.x, spawnloc.y, 'covid2');
    }


};