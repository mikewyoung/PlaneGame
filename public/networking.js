let socket = null;
let selfpid = -1;

// Countdown in seconds to game commencing
let countdown = 20;

// Index variable for the setInterval's return
let countdownTimer = -1;

function connect(){

    let modalBG = document.getElementsByClassName("modal")[0];
    let modalWindow = document.getElementById("name-entry");
    let h2 = modalWindow.getElementsByTagName("h2")[0];
    let nameBox = modalWindow.getElementsByTagName("input")[0];
    let name = modalWindow.getElementsByTagName("input")[0].value;
    let button = modalWindow.getElementsByTagName("button")[0];
    button.disabled = true;
    nameBox.disabled = true;
    h2.innerText = "Connecting to server...";

    if (name.length > 10){
        h2.innerHTML = "Name is too long."
        return;
    }

    socket = io("https://https://plane-race.herokuapp.com/", 
    {
        reconnectionDelayMax: 2000,
        query: {
            name: name
        },
        autoConnect: false
    });

    socket.connect();

    socket.on("connect", ()=>{
        console.log("Connected successfully");
        socket.emit("join");
        button.disabled = false;
        button.onclick = function(){disconnect()};
        button.innerText = "Cancel";
        h2.innerText = "Searching for players...";
    });

    socket.on("beginCountdown", (data)=>{
        console.log("Countdown: " + data.time);
        console.log("PID: " + data.pid);
        selfpid = data.pid;
        countdown = data.time;
        h2.innerText = "Game starting in " + countdown + " seconds.";
        if (countdownTimer != -1){
            return;
        }
        countdownTimer = setInterval(()=>{
            countdown--;
            if (countdown < 1){
                clearInterval(countdownTimer);
                countdownTimer = -1;
            }else
                h2.innerText = "Game starting in " + countdown + " seconds.";
        }, 1000)
    })

    socket.on("playerdisconnect", (data)=>{
        entities.forEach((entity)=>{
            if (entity.pid && entity.pid == data){
                entities.splice(entities.indexOf(entity), 1);
                console.log("Player disconnected");
            }
        })
    });
    
    socket.on("connect_error", ()=>{
        console.log("Failed to connect");
        handleDisconnect(false);
    })

    socket.on("disconnect", ()=>{
        console.log("Disconnected.")
        handleDisconnect(true);
    })

    socket.on("stopCountdown", ()=>{
        h2.innerText = "Searching for players...";
        clearInterval(countdownTimer);
        countdownTimer = -1;
    });

    socket.on("startGame", (data)=>{
        modalBG.classList.add("hidden");
        clearInterval(countdownTimer);
        resetCourse();
        startInterval();
        constructCourse(data.course);
        data.pids.forEach((pid)=>{
            if (pid != selfpid){
                console.log("Creating player with pid " + pid);
                new OtherPlayer(32, 32, pid);
            }
        })
    });

    socket.on("endGame", (data)=>{
        let modal = document.getElementsByClassName("modal")[1];
        modal.classList.remove("hidden");
        let window = modal.getElementsByClassName("modal-window")[0];
        let h2 = window.getElementsByTagName("h2")[0];
        let victoryString;
        switch (data){
            case 1:{
                victoryString = "1st place!";
            }
            break;

            case 2:{
                victoryString = "2nd place!";
            }
            break;

            case 3:{
                victoryString = "3rd place!";
            }
            break;

            default:{
                victoryString = data + "th place!";
            }
        }
        h2.innerHTML = victoryString;
    });

    socket.on("hurt", (pid)=>{
        entities.forEach((entity)=>{
            if (entity.pid == pid){
                entity.hurt();
            }
        })
    })

    socket.on("updateOthers", (data)=>{
        for(let i = 0; i < data.otherPlayers.length; i++){
            entities.forEach((entity)=>{
                if (entity.pid == data.otherPlayers[i].pid){
                    entity.left = data.otherPlayers[i].left;
                    entity.right = data.otherPlayers[i].right;
                    entity.direction = data.otherPlayers[i].direction;
                    let realX = data.otherPlayers[i].x;
                    let realY = data.otherPlayers[i].y;

                    entity.position = {x: realX, y: realY};

                    if (Math.abs(entity.position.x - realX) > 15){
                        entity.position.x = realX;
                    }

                    if (Math.abs(entity.position.y - realY) > 15){
                        entity.position.y = realY;
                    }
                }
            });
        }
    });





};

function disconnect(){
    socket.disconnect();
}

function handleDisconnect(graceful){
    clearInterval(interval);
    let modal = document.getElementsByClassName("modal")[1];
    modal.classList.add("hidden");
    let modal2 = document.getElementsByClassName("modal")[0];
    modal2.classList.remove("hidden");
    let modalWindow = modal2.getElementsByClassName("modal-window")[0];
    let h2 = modalWindow.getElementsByTagName("h2")[0];
    selfpid = -1;
    modalWindow.classList.remove("hidden");
    h2.innerText = "Enter your name";
    let button = modalWindow.getElementsByTagName("button")[0];
    let nameBox = modalWindow.getElementsByTagName("input")[0];
    button.innerText = "Play"
    modalWindow.classList.remove("hidden");
    button.onclick = function(){
        connect();
    }
    button.disabled = false;
    nameBox.disabled = false;
    if (countdownTimer != -1){
        clearInterval(countdownTimer);
        countdownTimer = -1;
    }

    if (graceful == true){
        h2.innerText = "Enter your name";
    }else{
        h2.innerText = "Failed to connect to game server."
    }
}