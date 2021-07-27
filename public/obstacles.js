let obstacles = [];
let obstacleHeight = 150;

const LEFT = 0;
const RIGHT = 1;

let currentSide = LEFT;

let screenWidth = 426;
let screenWidthHalf = 213; // Easy for referencing

obstacles[0] = {
    obstacleHeight: 100,
    difficulty: 0,
    width: 250,
    height: 25,
    create: function(){
        let xOffset = -10;
        if (currentSide == RIGHT){
            xOffset = screenWidth - this.width + 10;
        }

        new Box(xOffset, obstacleHeight, this.width, this.height);
    }
}

obstacles[1] = {
    obstacleHeight: 100,
    difficulty: 0,
    height: 25,
    gapWidth: 80,
    width: 400,
    create: function(){
        xOffset = 75;
        if (currentSide == RIGHT){
            xOffset = xOffset * -1;
        }
        
        let firstBoxX = screenWidthHalf - this.width - (this.gapWidth * .5) + xOffset;
        new Box(firstBoxX, obstacleHeight, this.width, this.height);
        new Box(firstBoxX + this.width + this.gapWidth, obstacleHeight, this.width, this.height);
    }
}

obstacles[2] = {
    obstacleHeight: 100,
    difficulty: 0,
    height: 25,
    gapWidth: 80,
    width: 400,
    create: function(){
        xOffset = 100;
        if (currentSide == RIGHT){
            xOffset = xOffset * -1;
        }
        
        let firstBoxX = screenWidthHalf - this.width - (this.gapWidth * .5) + xOffset;
        new Box(firstBoxX, obstacleHeight, this.width, this.height);
        new Box(firstBoxX + this.width + this.gapWidth, obstacleHeight, this.width, this.height);
    }
}

obstacles[3] = {
    obstacleHeight: 200,
    difficulty: 1,
    height: 100,
    gapWidth: 65,
    width: 400,
    create: function(){
        xOffset = 0;
        if (currentSide == RIGHT){
            xOffset = xOffset * -1;
        }
        
        let firstBoxX = screenWidthHalf - this.width - (this.gapWidth * .5) + xOffset;
        new Box(firstBoxX, obstacleHeight, this.width, this.height);
        new Box(firstBoxX + this.width + this.gapWidth, obstacleHeight, this.width, this.height);
    }
}

obstacles[4] = {
    obstacleHeight: 125,
    difficulty: 1,
    height: 25,
    gapWidth: 65,
    width: 400,
    create: function(){
        xOffset = 75;
        if (currentSide == RIGHT){
            xOffset = xOffset * -1;
        }
        
        let firstBoxX = screenWidthHalf - this.width - (this.gapWidth * .5) + xOffset;
        new Box(firstBoxX, obstacleHeight, this.width, this.height);
        new Box(firstBoxX + this.width + this.gapWidth, obstacleHeight, this.width, this.height);
    }
}

obstacles[5] = {
    obstacleHeight: 125,
    difficulty: 1,
    height: 25,
    gapWidth: 65,
    width: 400,
    create: function(){
        xOffset = 125;
        if (currentSide == RIGHT){
            xOffset = xOffset * -1;
        }
        
        let firstBoxX = screenWidthHalf - this.width - (this.gapWidth * .5) + xOffset;
        new Box(firstBoxX, obstacleHeight, this.width, this.height);
        new Box(firstBoxX + this.width + this.gapWidth, obstacleHeight, this.width, this.height);
    }
}

obstacles[6] = {
    obstacleHeight: 700,
    difficulty: 1,
    height: 100,
    gapWidth: 80,
    width: 400,
    create: function(){
        xOffset = 1;
        if (currentSide == RIGHT){
            xOffset = xOffset * -1;
        }
        
        let firstBoxX = screenWidthHalf - this.width - (this.gapWidth * .5) + xOffset;
        new Box(firstBoxX, obstacleHeight, this.width, this.height);
        new Box(firstBoxX + this.width + this.gapWidth, obstacleHeight, this.width, this.height);

        xOffset += Math.sign(xOffset) * 10;
        firstBoxX = screenWidthHalf - this.width - (this.gapWidth * .5) + xOffset;

        new Box(firstBoxX, obstacleHeight + (this.height * 1), this.width, this.height);
        new Box(firstBoxX + this.width + this.gapWidth, obstacleHeight + (this.height * 1), this.width, this.height);

        xOffset += Math.sign(xOffset) * 10;
        firstBoxX = screenWidthHalf - this.width - (this.gapWidth * .5) + xOffset;

        new Box(firstBoxX, obstacleHeight + (this.height * 2), this.width, this.height);
        new Box(firstBoxX + this.width + this.gapWidth, obstacleHeight + (this.height * 2), this.width, this.height);

        xOffset += Math.sign(xOffset) * 10;
        firstBoxX = screenWidthHalf - this.width - (this.gapWidth * .5) + xOffset;

        new Box(firstBoxX, obstacleHeight + (this.height * 3), this.width, this.height);
        new Box(firstBoxX + this.width + this.gapWidth, obstacleHeight + (this.height * 3), this.width, this.height);

        xOffset -= Math.sign(xOffset) * 10;
        firstBoxX = screenWidthHalf - this.width - (this.gapWidth * .5) + xOffset;

        new Box(firstBoxX, obstacleHeight + (this.height * 4), this.width, this.height);
        new Box(firstBoxX + this.width + this.gapWidth, obstacleHeight + (this.height * 4), this.width, this.height);

        xOffset -= Math.sign(xOffset) * 10;
        firstBoxX = screenWidthHalf - this.width - (this.gapWidth * .5) + xOffset;

        new Box(firstBoxX, obstacleHeight + (this.height * 5), this.width, this.height);
        new Box(firstBoxX + this.width + this.gapWidth, obstacleHeight + (this.height * 5), this.width, this.height);

    }
}

obstacles[7] = {
    obstacleHeight: 125,
    difficulty: 1,
    height: 25,
    gapWidth: 75,
    width: screenWidth + 20,
    create: function(){
        xOffset = 0;

        if (currentSide == RIGHT){
            new Box(xOffset-10, obstacleHeight, 100, 25);
            new Box(xOffset-10 + 180, obstacleHeight, 100, 50);
            new Box(xOffset-10 + 320, obstacleHeight, 200, 50);

            // Add a second row
            new Box(xOffset-10 + 180 + 10, obstacleHeight + 50, 100, 50);
            new Box(xOffset-10 + 320 + 10, obstacleHeight + 50, 200, 50);
        }else{

            new Box(xOffset - 10, obstacleHeight, 50, 50);
            new Box(xOffset + 80, obstacleHeight, 200, 50);
            new Box(xOffset - 10 + 50 + 40 + 250, obstacleHeight, 200, 50);

        }
    }
}

obstacles[8] = {
    obstacleHeight: 125,
    create: function(){
        new Goal(0, obstacleHeight);
    }
}

function createObstacle(obstacle){

    obstacles[obstacle].create();
    obstacleHeight += obstacles[obstacle].obstacleHeight;

    if (currentSide == LEFT){
        currentSide = RIGHT
    }else{
        currentSide = LEFT;
    }
}

function constructCourse(courses){
    courses.forEach((course)=>{
        createObstacle(course);
    })
}