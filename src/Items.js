import { EntityMan } from "./EntityMan.js";
import { TossCoin } from './Math.js';

export const Items  = {
    CHAIN  : 'chain',
    SHOTGUN  : 'shotgun',
    SLINGSHOT  : 'slingshot'
};
export const ItemIcons  = {
    CHAIN  : 'chainicon',
    SHOTGUN  : 'shotgunicon',
    SLINGSHOT: 'slingshoticon'
};
export const ItemSound = {
    CHAIN  : 'shoot_pop',
    SHOTGUN  : 'shoot_bang',
    SLINGSHOT: 'shoot_twang'
};



export class ItemMan { 
    
    static items;  // ground Items
    static scene;
    
    static Init(scene) { 
        ItemMan.scene = scene;
        ItemMan.items = scene.add.group({
            classType: Item,
            maxSize: 4,
            runChildUpdate: true,
            removeCallback: function(item) {
                ItemMan.scene.lights.removeLight(item.glow);
            }
        });
        scene.physics.add.overlap(ItemMan.items, EntityMan.player, getItem);
    }
    
    
    static Update() {}
    
    
    static addItem(type, loc) {
            let i = ItemMan.items.get(loc.x, loc.y, type);
            if(i) {
                i.setPipeline('Light2D');
                i.glow = ItemMan.scene.lights.addLight(i.x, i.y, 200, 0xFF3333);
            }

    }
      
}


function getItem(Item, Player) {
    switch(Item.type) {
        case ItemIcons.CHAIN:
            Player.SetWeapon(Items.CHAIN, 200);
            break;
        case ItemIcons.SLINGSHOT:
            Player.SetWeapon(Items.SLINGSHOT, -1);
            break;
        case ItemIcons.SHOTGUN:
            Player.SetWeapon(Items.SHOTGUN, 15);
            break;
            // Change player texture
    }
    Item.destroy();
}







export class Item extends Phaser.GameObjects.Sprite {
    glow;
    type;
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        switch(texture) {
            case ItemIcons.CHAIN:
                this.setDepth(0.1);
                this.setScale(0.6);
                this.type = ItemIcons.CHAIN;
                scene.physics.world.enable(this);
                break;
            case Items.CHAIN:
                this.type = Items.CHAIN;
                this.setScale(0.6);
                break;
            case Items.SLINGSHOT:
                this.setScale(0.6);
                this.type = Items.SLINGSHOT;
                break;
            case ItemIcons.SLINGSHOT:
                this.setDepth(0.1);
                this.setScale(0.6);
                this.type = ItemIcons.SLINGSHOT;
                scene.physics.world.enable(this);
                break;
            case Items.SHOTGUN:
                this.setScale(1.5);
                this.type = Items.SHOTGUN;
                break;
            case ItemIcons.SHOTGUN:
                this.setDepth(0.1);
                this.setScale(0.6);
                this.type = ItemIcons.SHOTGUN;
                scene.physics.world.enable(this);
                break;
                
        }
        scene.add.existing(this);
        this.setDepth(0.2);
    }
    
    
    update() {}
    
    static RandomItem() {
        return TossCoin(0.3) ? ItemIcons.CHAIN : ItemIcons.SHOTGUN;
    }
    
    
}


Phaser.GameObjects.GameObjectFactory.register('item', function (x, y, texture) {
	const cc = new Item(this.scene, x, y, texture);
    this.displayList.add(cc);
    this.updateList.add(cc);
    return cc;
});