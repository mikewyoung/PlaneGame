let canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

let internalResolution = {width: 426, height: 240};
canvas.width = internalResolution.width;
canvas.height = internalResolution.height;


let controller = {"ArrowLeft": false, "ArrowRight": false};

// Variable for storing set interval that sends key and position data to server
let interval;


// Resize the canvas upon any tampering with the browser window
window.addEventListener("resize", (reportWindowSize) =>{
    resizeCanvas();
});

function resizeCanvas(){
    
    let idealWidth = 426;
    let idealHeight = 240;

    canvas.width = idealWidth;
    canvas.height = idealHeight;
    

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

}


window.addEventListener("keydown", (e) =>{
    if (controller[e.key] == undefined) return;
    controller[e.key] = true;
})

window.addEventListener("keyup", (e) =>{
    if (controller[e.key] == undefined) return;
    controller[e.key] = false;
})

function lengthDirX(length, direction){
    // Since cos is only for radians, we have to multiply by Pi / 180.
    return length * Math.cos(direction * Math.PI / 180);
}

function lengthDirY(length, direction){
    // Return must be multiplied by -1 because the Y axis goes from top to bottom.
    return length * Math.sin(direction * Math.PI / 180) * -1;
}



const draw = {
    image: function(image, x, y, rotation = 0){
        ctx.save();
        ctx.translate(x - camera.position.x, y - camera.position.y);
        ctx.rotate(rotation);
        ctx.drawImage( image, -image.width / 2, -image.height / 2);
        ctx.restore();
    },

    square: function(x, y, size, color = "##FF000"){
        ctx.fillStyle = color;
        ctx.fillRect(x - camera.position.x, y - camera.position.y, size, size);
    },

    sprite: function(sprite, frame = 0, x, y, rotation = 0, scaleX = 1, scaleY = 1){
        if (!(sprite instanceof Sprite)){
            console.log("Not a sprite");
            return;
        }

        ctx.save();
        ctx.rotate(rotation);
        ctx.drawImage(sprite.image, sprite.width * frame, 0, sprite.width, sprite.height, x - camera.position.x, y - camera.position.y, (sprite.width * scaleX), (sprite.height * scaleY));
        ctx.restore();

    }
}

let background, player, camera;

function resetCourse(){
    entities = [];
    background = new Background();
    player = new Plane(32, 32);
    camera = new Camera(30, 30);
    camera.setTarget(player);
}

resetCourse();

let lastTime;
let msPerFrame = (1000/60);

function renderLoop(now){
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;

    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, width, height);

    if (!lastTime){
        lastTime = now;
    }

    let elapsed = now - lastTime;

    if (elapsed >= msPerFrame){
        entities.forEach((entity)=>{
            if (entity.step){
                entity.step();
            }
        })
        lastTime = now;
    }
    

    entities.forEach(function(entity){

        if(entity.render)
            entity.render();
    });

    requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop)

function startInterval(){
    interval = setInterval(()=>{
        if (socket && socket != null & socket.connected == true){
            socket.emit("keys", {direction: player.direction, left: controller["ArrowLeft"], right: controller["ArrowRight"], x: player.position.x, y: player.position.y});
        }
    }, 50);
}