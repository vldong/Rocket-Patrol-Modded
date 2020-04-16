//Scout Prefab
class Scout extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        
        //add object to existing scene
        scene.add.existing(this);
        this.points = pointValue;

    }

    update() {
        //move spaceships left
        this.x -= game.settings.spaceshipSpeed+1.5;
        //wraparound behavior
        if(this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
       
    }

    reset(){
        this.x = game.config.width;
    }
}