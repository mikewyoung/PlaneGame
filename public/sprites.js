class Sprite{
    constructor(src, width, height, frames, originX = 0, originY = 0){
        this.image = new Image();
        this.image.src = src;
        this.frames = frames;
        this.originX = originX;
        this.originY = originY;
        this.width = width;
        this.height = height;
    }

    getLength(){
        return this.frames;
    }
}

const sprites = {
    plane: new Sprite("/assets/plane.png", 24, 19, 9),
    background: new Sprite("assets/house_bg.png", 192, 256, 1),
    sky: new Sprite("assets/sky.png", 240, 255),
    topLeft: new Sprite("assets/top_left.png", 6, 6),
    topRight: new Sprite("assets/top_right.png", 6, 6),
    bottomLeft: new Sprite("assets/bottom_left.png", 6, 6),
    bottomRight: new Sprite("assets/bottom_right.png", 6, 6),
    horizontalSlice: new Sprite("assets/horizontal_slice.png", 1, 4),
    verticalSlice: new Sprite("assets/vertical_slice.png", 4, 1),
    checkerboard: new Sprite("assets/checkerboard.png", 8, 6)
}
