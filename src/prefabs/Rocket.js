//Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        //add object to existing scene
        scene.add.existing(this);
        //track rocket firing status
        this.isFiring = false;
        //rocket audio
        this.sfxRocket = scene.sound.add('sfx_rocket');
    }

    update() {
        //left/right movement
        if (!this.isFiring) {
            if(keyLEFT.isDown && this.x >= 47){//isDown: hold button to trigger, updates every frame
                this.x -= 2;
            } else if (keyRIGHT.isDown &&this.x <= 578) {
                this.x += 2;
            }
        }
        //fire
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring){ //JustDown: was the button down last frame?
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }
        //if fired, move up
        if(this.isFiring && this.y >= 108) {
            this.y -= 2;
        }
        //reset on miss
        if(this.y <= 108) {
            this.isFiring = false;
            this.y = 431;
        }
    }
    //reset rocket to start
    reset() {
        this.isFiring = false;
        this.y = 431
    }
}