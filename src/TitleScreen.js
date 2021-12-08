
export class ImageButton extends Phaser.GameObjects.Image {
    
    constructor(scene, x, y, texture, callback) {
        super(scene, x, y, texture);
        
        // this.setTexture('PlayButton');
        // this.setPosition(x, y);
        
        this.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.enterButtonHoverState() )
            .on('pointerout', () => this.enterButtonRestState() )
            .on('pointerdown', () => this.enterButtonActiveState() )
            .on('pointerup', () => {
                this.setInteractive({ useHandCursor: false }); // probably does nothing
                this.enterButtonHoverState();
                callback();
        });
        scene.add.existing(this);
    }
    
    preUpdate(time, delta) {}
    update(t, dt) {}
    
    
    enterButtonHoverState() {
        // add a border or make lighter. 2nd image that appears on hover.
        this.setTint(0x1287CD);
    }
    
    enterButtonRestState() {
        this.clearTint();
    }
    
    enterButtonActiveState() {
        this.setTint(0x808080);
    }
}



Phaser.GameObjects.GameObjectFactory.register('ImgButton', function (x, y, texture, cb) {
	const cc = new ImageButton(this.scene, x, y, texture, cb);
    this.displayList.add(cc);
    this.updateList.add(cc);
    return cc;
});



export class UserInterface extends Phaser.Scene {

    score;
    ammoText;
    scoreText;
    livesText;
    
    constructor(config) {
        super({ key: 'ui'});
    }
    
    preload() {}
    
    create(data)
    {
        this.score = 0;
        this.scoreText = this.add.text(10, 50, 'Score: 0', { fill: '#0f0' });
        this.ammoText = this.add.text(10, 80, 'Ammo: ∞', { fill: '#0f0' });
        this.livesText = this.add.text(10, 110, 'Lives: 3', { fill: '#0f0' });
        
        
        var ourGame = this.scene.get('game');

        ourGame.events.on('addScore', function (value) {
            this.score += value;
            this.scoreText.setText('Score: ' + this.score);
        }, this);
        
        ourGame.events.on('ammoChange', function (value) {
            if(value <= 0) value = '∞';
            this.ammoText.setText('Ammo: ' + value);
        }, this);
        
        ourGame.events.on('livesChange', function (value) {
            this.livesText.setText('Lives: ' + value);
            if(value <= 0) {
                this.scene.restart();
                this.scene.sleep('ui');
            }
        }, this);
        
    }

};

export class TitleScreen extends Phaser.Scene {

    constructor(config) {
        super(config);
    }

    preload() {
        this.load.image({ key: 'TitleScreen', url: 'data/gfx/backgroundLab.jpg' });
        this.load.image({ key: 'Logo', url: 'data/gfx/logo.png' });
        this.load.image({ key: 'PlayButton', url: 'data/gfx/PlayButton.svg' });
    }


    create(data) {
        let w = this.sys.canvas.width;
        let h = this.sys.canvas.height;
        
        this.ts = this.add.image(0, 0, 'TitleScreen').setOrigin(0, 0).setDisplaySize(w, h);
        this.logo = this.add.image(w/2, h/6, 'Logo').setOrigin(0.5, 0.5);//.setScale(0.3);//.setDisplaySize(w, h);
        this.pb = this.add.ImgButton(w/2, h/2, 'PlayButton', () => this.play()).setOrigin(0.5, 0.5);
   
    }
        
        
    play() {
        
        // this.ts.visible = false;
        // this.logo.visible = false;
        // this.pb.visible = false;
        // this.scene.pause();
        // this.scene.sleep('default');
        // this.scene.launch('game');
        this.scene.switch('game');
    
    }
}

