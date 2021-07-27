// Array to keep track of all ents
let entities = [];

class Camera{
    constructor(x = 0, y = 0){
        this.position = {x: x, y: y};
        this.cameraWidth = 640;
        this.pid = -1;
        this.cameraHeight = 480;
        entities.push(this);
    }

    step(){
        if (this.target){
            //this.position.x = this.target.position.x - canvas.width / 2;
            this.position.x = 0;
            this.position.y = this.target.position.y - canvas.height / 2 + 50;
        }
    }

    setTarget(target){
        this.target = target;
    }
}

class Plane{
    constructor(x, y){
        this.position = {x: x, y: y};
        this.direction = -15;
        this.speed = 1.5;
        this.width = 24;
        this.height = 19;
        entities.push(this);
        this.frameIndex = 0;
        this.pid = -1;
        this.speedAngle = 1;
        this.stun = 0;
        this.flash = 0;
    }

    hurt(){
        this.stun = 90;
        this.flash = 120;
        if (socket && socket != null & socket.connected == true){
            socket.emit("hurt");
        }
    }

    step(){

        if(this.position.x < 0){
            this.position.x = 0;
        }

        if (this.position.x + this.width > screenWidth){
            this.position.x = screenWidth - this.width;
        }

        this.flash--;
        this.stun--;
        if (this.stun > 0){
            return;
        }
        if (controller["ArrowLeft"] == true){
            this.direction -= 4;
            if (this.direction < -165){
                this.direction = -165;
            }
        }

        if (controller["ArrowRight"] == true){
            this.direction += 4;
            if (this.direction > -15){
                this.direction = -15;
            }
        }



        if (this.direction <= -15){
            this.frameIndex = 8;
            this.speedAngle = 1;
        }

        if (this.direction <= -15 - (17.77 * 1)){
            this.frameIndex = 7;
            this.speedAngle = 1.1;
        }

        if (this.direction <= -15 - (17.77 * 2)){
            this.frameIndex = 6;
            this.speedAngle = 1.25;
        }

        if (this.direction <= -15 - (17.77 * 3)){
            this.frameIndex = 5;
            this.speedAngle = 1.50;
        }

        if (this.direction <= -15 - (17.77 * 4)){
            this.frameIndex = 4;
            this.speedAngle = 1.85;
        }



        if (this.direction <= -15 - (17.77 * 5)){
            this.frameIndex = 3;
            this.speedAngle = 1.50;
        }

        if (this.direction <= -15 - (17.77 * 6)){
            this.frameIndex = 2;
            this.speedAngle = 1.25;
        }

        if (this.direction <= -15 - (17.77 * 7)){
            this.frameIndex = 1;
            this.speedAngle = 1.1;
        }

        if (this.direction <= -15 - (17.77 * 8)){
            this.frameIndex = 0;
            this.speedAngle = 1;
        }

        if (this.frameIndex != 4){
            this.position.x += lengthDirX(this.speed, this.direction) * this.speedAngle;
            this.position.y += lengthDirY(this.speed, this.direction) * this.speedAngle;
        }else{
            this.position.y += this.speed * this.speedAngle;
        }
    }

    render(){
        
        if (this.flash > 0 && Math.floor(this.flash / 10) & 1){
            return;
        }
        draw.sprite(sprites.plane, this.frameIndex, this.position.x, this.position.y, 0, this.scaleX, 1);
    }
}

class Background{
    constructor(){
        entities.push(this);
    }

    render(){

        let offset = (camera.position.y * 0.8) % sprites.sky.height + sprites.sky.height;
        let houseOffset = (camera.position.y) % sprites.background.height + sprites.background.height;

        // Draw sky in the background
        for(let i = 0; i < 3; i++){

            draw.sprite(sprites.sky, 0, camera.position.x + -sprites.sky.width,(i * sprites.sky.height) +  camera.position.y - offset , 0, 1, 1);
            draw.sprite(sprites.sky, 0, camera.position.x, (i * sprites.sky.height) + camera.position.y - offset, 0, 1, 1);
            draw.sprite(sprites.sky, 0, camera.position.x + sprites.sky.width, (i * sprites.sky.height) + camera.position.y - offset, 0, 1, 1);
        }
        

        for(let i = 0; i < 3; i++){

            draw.sprite(sprites.background, 0, camera.position.x + -sprites.background.width,(i * sprites.background.height) +  camera.position.y - houseOffset , 0, 1, 1);
            draw.sprite(sprites.background, 0, camera.position.x, (i * sprites.background.height) + camera.position.y - houseOffset, 0, 1, 1);
            draw.sprite(sprites.background, 0, camera.position.x + sprites.background.width, (i * sprites.background.height) + camera.position.y - houseOffset, 0, 1, 1);
            draw.sprite(sprites.background, 0, camera.position.x + sprites.background.width * 2, (i * sprites.background.height) + camera.position.y - houseOffset, 0, 1, 1);
        }
    }


}

class Box{
    constructor(x, y, width, height){
        this.width = width;
        this.height = height;
        this.position = {x: x, y: y};
        this.collisionsActive = true;
        this.pid = -1;
        entities.push(this);
    }

    step(){
        if (this.collisionsActive == true &&
            player.position.x < this.position.x + this.width &&
            player.position.x + player.width > this.position.x
            && player.position.y < this.position.y + this.height
            && player.position.y + player.height > this.position.y){
                console.log("Collided!");
                this.collisionsActive = false;
                player.hurt();
        }

    }

    render(){
        // First, draw the corners.
        draw.sprite(sprites.topLeft, 0, this.position.x, this.position.y, 0, 1, 1);
        draw.sprite(sprites.topRight, 0, this.position.x + this.width - sprites.topRight.width, this.position.y, 0, 1, 1);
        draw.sprite(sprites.bottomLeft, 0, this.position.x, this.position.y + this.height - sprites.bottomRight.height, 0, 1, 1);
        draw.sprite(sprites.bottomRight, 0, this.position.x + this.width - sprites.bottomRight.width, this.position.y + this.height - sprites.bottomRight.height, 0, 1, 1);

        // Draw the horizontal sides
        draw.sprite(sprites.horizontalSlice, 0, this.position.x + sprites.topLeft.width, this.position.y, 0, this.width - (sprites.topLeft.width * 2), 1);
        draw.sprite(sprites.horizontalSlice, 0, this.position.x + sprites.topLeft.width, this.position.y + this.height - sprites.horizontalSlice.height, 0, this.width - (sprites.topLeft.width * 2), 1);

        // Draw the vertical sides
        draw.sprite(sprites.verticalSlice, 0, this.position.x, this.position.y + sprites.topLeft.height, 0, 1, this.height - (sprites.topLeft.height * 2));
        draw.sprite(sprites.verticalSlice, 0, this.position.x + this.width - sprites.verticalSlice.width, this.position.y + sprites.topLeft.height, 0, 1, this.height - (sprites.topLeft.height * 2));
    }
}

class OtherPlayer{
    constructor(x, y, pid){
        this.position = {x: x, y: y};
        console.log(this.position);
        this.pid = pid;
        this.direction = -15;
        this.speed = 1.5;
        this.width = 24;
        this.height = 19;
        this.frameIndex = 0;
        this.speedAngle = 1;
        this.stun = 0;
        this.flash = 0;
        this.left = false;
        this.right = false;
        entities.push(this);
    }

    hurt(){
        this.stun = 90;
        this.flash = 120;
    }

    step(){

        if(this.position.x < 0){
            this.position.x = 0;
        }

        if (this.position.x + this.width > screenWidth){
            this.position.x = screenWidth - this.width;
        }

        this.flash--;
        this.stun--;
        if (this.stun > 0){
            return;
        }

        if (this.left == true){
            this.direction -= 4;
            if (this.direction < -165){
                this.direction = -165;
            }
        }

        if (this.right == true){
            this.direction += 4;
            if (this.direction > -15){
                this.direction = -15;
            }
        }



        if (this.direction <= -15){
            this.frameIndex = 8;
            this.speedAngle = 1;
        }

        if (this.direction <= -15 - (17.77 * 1)){
            this.frameIndex = 7;
            this.speedAngle = 1.1;
        }

        if (this.direction <= -15 - (17.77 * 2)){
            this.frameIndex = 6;
            this.speedAngle = 1.25;
        }

        if (this.direction <= -15 - (17.77 * 3)){
            this.frameIndex = 5;
            this.speedAngle = 1.50;
        }

        if (this.direction <= -15 - (17.77 * 4)){
            this.frameIndex = 4;
            this.speedAngle = 1.85;
        }



        if (this.direction <= -15 - (17.77 * 5)){
            this.frameIndex = 3;
            this.speedAngle = 1.50;
        }

        if (this.direction <= -15 - (17.77 * 6)){
            this.frameIndex = 2;
            this.speedAngle = 1.25;
        }

        if (this.direction <= -15 - (17.77 * 7)){
            this.frameIndex = 1;
            this.speedAngle = 1.1;
        }

        if (this.direction <= -15 - (17.77 * 8)){
            this.frameIndex = 0;
            this.speedAngle = 1;
        }

        if (this.frameIndex != 4){
            this.position.x += lengthDirX(this.speed, this.direction) * this.speedAngle;
            this.position.y += lengthDirY(this.speed, this.direction) * this.speedAngle;
        }else{
            this.position.y += this.speed * this.speedAngle;
        }
    }

    render(){
        
        if (this.flash > 0 && Math.floor(this.flash / 10) & 1){
            return;
        }
        draw.sprite(sprites.plane, this.frameIndex, this.position.x, this.position.y, 0, this.scaleX, 1);
    }
}

class Goal{
    constructor(x, y){
        this.position = {};
        this.position.x = x;
        this.position.y = y;
        entities.push(this);
        this.width = screenWidth;
        this.height = 6;
        this.collisionsActive = true;
    }

    step(){
        if (this.collisionsActive == true &&
            player.position.x < this.position.x + this.width &&
            player.position.x + player.width > this.position.x
            && player.position.y < this.position.y + this.height
            && player.position.y + player.height > this.position.y){
                this.collisionsActive = false;
                socket.emit("won");
        }
    }

    render(){
        for(let i = 0; i < Math.ceil(screenWidth / sprites.checkerboard.width); i++){
            draw.sprite(sprites.checkerboard, 0, this.position.x + sprites.checkerboard.width * i, this.position.y, 0, 1, 1);
        }
    }
}