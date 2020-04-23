let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
    //configs allow physics configurations, 
    //web browser scaling, size, etc.
};

let game = new Phaser.Game(config);
    // define game settings
    game.settings = {
        spaceshipSpeed: 3,
        gameTimer: 60000    
    }

//reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT;

//mods:
//New Menu (15)
//New background tilesprite (10)
//parallax scrolling (15)
//new ship (25)
//timer (15)
//Fire! UI text (10)
//background music (10)