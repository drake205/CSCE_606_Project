
export class ImageButton extends Phaser.GameObjects.Image {
    
    constructor(scene, x, y, texture, callback) {
        super(scene, x, y, texture);
        
        this.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.enterButtonHoverState() )
            .on('pointerout', () => this.enterButtonRestState() )
            .on('pointerdown', () => this.enterButtonActiveState() )
            .on('pointerup', () => {
                this.setInteractive({ useHandCursor: false }); 
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

    ammoText;
    scoreText;
    livesText;
    
    constructor(config) {
        super({ key: 'ui'});
    }
    
    preload() {}
    
    create(data)
    {
        this.scoreText = this.add.text(10, 50, 'Score: 0' , {fontFamily: 'Courier New', fontSize: 20, fill: '#0f0' });
        this.gameText = this.add.text(10, 20, 'Game Progress: 0%', {fontFamily: 'Courier New', fontSize: 20, fill: '#0f0' });
        this.ammoText = this.add.text(10, 80, 'Ammo: Unlimited', {fontFamily: 'Courier New', fontSize: 20, fill: '#0f0' });
        this.livesText = this.add.text(10, 110, 'Lives: 4', {fontFamily: 'Courier New', fontSize: 20, fill: '#0f0' });
        
        // on destruction this
        var ourGame = this.scene.get('game');

        ourGame.events.on('scoreChange', function (value) {
            this.scoreText.setText('Score: ' + value);
            this.gameText.setText('Game Progress: ' + ((value/95000)*100).toFixed(2) + '%');
        }, this);
        
        ourGame.events.on('ammoChange', function (value) {
            if(value <= 0) value = 'Unlimited';
            this.ammoText.setText('Ammo: ' + value);
        }, this);
        
        ourGame.events.on('livesChange', function (value) {
            this.livesText.setText('Lives: ' + value);
            if(value <= 0) {
                this.scene.sendToBack('ui');
                this.scene.restart();
                this.scene.sleep('ui');
            }
        }, this);
        
    }

}

export class TitleScreen extends Phaser.Scene {

    constructor(config) {
        super(config);
    }

    preload() {
        this.load.image({ key: 'TitleScreen', url: 'data/gfx/backgroundLab.jpg' });
        this.load.image({ key: 'Logo', url: 'data/gfx/logo23.png' });
        this.load.image({ key: 'PlayButton', url: 'data/gfx/PlayButton.svg' });
        this.load.image({ key: 'CreditsButton', url: 'data/gfx/CreditsButton.svg' });
        this.load.image({ key: 'MoveKeys', url: 'data/gfx/WASDkeysHelp.svg' });
    }


    create(data) {
        let w = this.sys.canvas.width;
        let h = this.sys.canvas.height;
        
        this.ts = this.add.image(0, 0, 'TitleScreen').setOrigin(0, 0).setDisplaySize(w, h);
        this.logo = this.add.image(w/2, h/6, 'Logo').setOrigin(0.5, 0.5);
        this.logo.setScale(Math.min(w / this.logo.displayWidth, h / this.logo.displayHeight)/1.5);
        if(this.sys.game.device.os.desktop)
            this.help = this.add.image(w, 0, 'MoveKeys').setOrigin(1, 0);
        this.pb = this.add.ImgButton(w/2, h/2, 'PlayButton', () => this.play()).setOrigin(0.5, 0.5);
        this.cb = this.add.ImgButton(w/2, h/2+this.pb.displayHeight*1.5, 'CreditsButton', () => this.scene.switch('credits')).setOrigin(0.5, 0.5);
   
    }
        
  

    
    play() {
        this.scene.switch('game');
    }
    
}

export class Credits extends Phaser.Scene {

    constructor(config) {
        super('credits');
    }

    preload() {
        this.load.image({ key: 'CreditsBG', url: 'data/gfx/CreditsScreen.png' });
        this.load.image({ key: 'mainmenubtn', url: 'data/gfx/MainMenuButton.svg' });
    }


    create() {
        let w = this.sys.canvas.width;
        let h = this.sys.canvas.height;

        this.cs = this.add.image(0, 0, 'CreditsBG').setOrigin(0, 0).setDisplaySize(w, h);
        this.mb = this.add.ImgButton(w/2, h/2.5, 'mainmenubtn', () => this.scene.switch('default')).setOrigin(0.55, 0.55);
        this.mb.setScale(Math.min(w / this.mb.displayWidth, h / this.mb.displayHeight)/4);
   
    }
}