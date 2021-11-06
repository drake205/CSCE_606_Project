

export class CovidCell extends Phaser.GameObjects.Sprite {

 
    
    constructor(scene, x, y, texture) {
        

        super(scene, x, y, texture);
        
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        scene.add.existing(this);
        this.setScale(0.25);


        this.angle = 0;
        this.max_velocity = 10;


    }
    
    setTarget(target)
	{
		this.target = target
	}
    
    update() {
        // this.body.rotate += 0.05;
        this.angle += 1;
        if (this.target)
		{
			const tx = this.target.x
		    const ty = this.target.y
		    const x = this.body.x
    		const y = this.body.y
    
    		const rotation = Phaser.Math.Angle.Between(x, y, tx, ty)
    		this.setRotation(rotation)
    		
		  //  game.physics.arcade.velocityFromRotation(rotation, 150, this.body.velocity);
		    
		}
		this.scene.physics.velocityFromRotation(this.rotation, 150, this.body.velocity);

		

		
    }
    
    
    
};


Phaser.GameObjects.GameObjectFactory.register('enemy', function (x, y, texture) {
	const cc = new CovidCell(this.scene, x, y, texture);
    this.displayList.add(cc);
    this.updateList.add(cc);
    return cc;
});