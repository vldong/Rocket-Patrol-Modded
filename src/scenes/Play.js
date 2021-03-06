class Play extends Phaser.Scene{
    constructor() {
        super("playScene");
    }
    timeLimit = game.settings.gameTimer/1000;
    timeText;
    oneSec;



    preload() {
        //load images and tile sprite
        this.load.image("rocket", "./assets/rocket.png");
        this.load.image("spaceship", "./assets/spaceship.png");
        this.load.image("scout", "./assets/scout.png");
        //new starfield +10 PTS
        //parallax scrolling +15 PTS
        this.load.image("starfield01", './assets/starfield.png');
        this.load.image("starfield02", './assets/starfield2.png');
        this.load.image("starfield03", './assets/starfield3.png');
        this.load.spritesheet("explosion", './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.audio("music", './assets/bgmusic.mp3');
    }

    create() {
        //place tile sprite (x3)
        this.starfield01 = this.add.tileSprite(0,0,640,480, 'starfield01').setOrigin(0,0);
        this.starfield02 = this.add.tileSprite(0,0,640,480, 'starfield02').setOrigin(0,0);
        this.starfield03 = this.add.tileSprite(0,0,640,480, 'starfield03').setOrigin(0,0);

        //white border
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);

        //green UI background
        this.add.rectangle(37, 42, 566, 64,0x00FF00).setOrigin(0,0);

        //add rocket (p1)
        //constructor(scene, x, y, texture, frame)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket').setScale(0.5,0.5).setOrigin(0, 0);

        //add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 164, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 212, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width , 260, 'spaceship', 0, 10).setOrigin(0, 0);

        //add scout
        //NEW SHIP, +25 PTS
        this.ship04 = new Scout(this, game.config.width, 116, 'scout', 0, 50).setOrigin(0, 0);

        //define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        //animation config
        this.anims.create({
            key:'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        //score
        this.p1Score = 0;
        //score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        //game over flag
        this.gameOver = false;

        //create 60 second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, ()=>{
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        //clock display
        let clockConfig = {
            fontFamily: 'Courier',
            fontSize: "28px",
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        //create timer +15 PTS
        //create clock
        this.timeText = this.add.text(571, 54, '', clockConfig).setOrigin(1,0);
        this.timeText.text = game.settings.gameTimer/1000;
        //create 1 sec timer for decrementing clock
        var oneSec = this.time.addEvent({
            delay: 1000,
            callback: this.onEvent,
            callbackScope: this,
            repeat: (game.settings.gameTimer/1000)-1,
        });
        //create FIRE! UI text +10 PTS
        //display
        let fireConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFF200',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.fireMid = this.add.text(320, 54, 'FIRE!', fireConfig).setOrigin(0.5, 0);
        //create background music +10 PTS
        //music config for loop
        let soundConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        let bg = this.sound.add('music', soundConfig);
        bg.play();
    
    }

    update() {
        if (this.p1Rocket.isFiring == true){
            this.fireMid.alpha = 0;
        } else {
            this.fireMid.alpha = 1;
        }
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)){
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.scene.start("menuScene");
        }
        //scroll starfield
        this.starfield01.tilePositionX -= 2;
        this.starfield02.tilePositionX -= 3;
        this.starfield03.tilePositionX -= 4;
        //update rockets and spaceships if game is NOT OVER
        if (!this.gameOver){
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
            this.displayTimeRemaining;
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }


    }

    onEvent(){
        this.timeText.text--;
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;
        //create explosion at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');          //play animation
        boom.on('animationcomplete', () => { //callback after anim is done
            ship.reset();                    //reset ship position
            ship.alpha = 1;                  //make ship visible
            boom.destroy();                  //remove explosion sprite
        });
        //scoring
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        //ship explode sound
        this.sound.play('sfx_explosion');
    }

}
//python -m http.server
//then go to browser and go to localhost:8000