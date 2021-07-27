const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const { urlToHttpOptions } = require("url");
const io = new Server(server);
let pid = 0;

app.use(express.static('public'));

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/index.html");
});


let port = process.env.PORT || 8081;
server.listen(port, (socket) =>{
    console.log("Listening on " + port);
});

io.on("connection", (socket)=>{
    console.log("Socket opened");
    let name = socket.handshake.query['name'];
    if (typeof name != "string" || name.length == 0 || name.length > 10){
        name = "Player";
    }
    socket.name = name;
    socket.pid = pid;
    pid++;
    console.log(name + " joined the server.");
    waitingGame.addPlayer(socket);
})

const WAITING = 0;
const PLAYING = 1;
const COMPLETED = 2;

class Game{
    constructor(){
        this.maxPlayers = 10;
        this.state = WAITING;
        this.players = [];
        this.timeLeft = 10;
        this.place = 0;
        this.tick = setInterval(()=>{

            if (this.state == WAITING){
                return;
            }

            let sendData = {otherPlayers: []};
            this.players.forEach((player)=>{
                sendData.otherPlayers.push({direction: player.direction, pid: player.pid, x: player.x || 32, y: player.y || 32, left: player.left || false, right: player.right || false})
            })

            this.players.forEach((player)=>{
                player.emit("updateOthers", sendData);
            })
        }, 50);
    }

    addPlayer(socket){
        // Add player to list of playerrs
        this.players.push(socket);

        // Add an even listener for a player disconnecting.
        socket.on("disconnect", (socket)=>{
            let disconnectedPid = socket.pid;
            this.players.splice(this.players.indexOf(socket), 1);
            console.log("Player disconnected from game");

            if (this.state != WAITING){
                this.players.forEach((socket)=>{
                    socket.emit("playerdisconnect", disconnectedPid);
                })

                if (this.players.length < 1){
                    this.cleanUp();
                }
                return;
            }
            // If the player count goes down to one, stop the game countdown.
            if (this.players.length == 1){
                clearInterval(this.countDown);
                this.timeLeft = 10;
                this.players.forEach((socket)=>{
                    socket.emit("stopCountdown");
                });
            }
        });

        socket.on("hurt", ()=>{
            let pid = socket.pid;
            this.players.forEach((socket)=>{
                if (pid != socket.pid){
                    socket.emit("hurt", pid);
                }
            })
        })

        socket.on("keys", (data)=>{
            socket.left = data.left;
            socket.right = data.right;
            socket.x = data.x;
            socket.y = data.y;
            socket.direction = data.direction;
        })

        socket.on("won", ()=>{
            this.place++;
            socket.emit("endGame", this.place);
        })

        if (this.players.length == 2 && this.state == WAITING){
            this.players.forEach((socket)=>{
                socket.emit("beginCountdown", {time: this.timeLeft, pid: socket.pid});
            })

            let countDown = setInterval(()=>{
                this.timeLeft--;

                if (this.timeLeft < 1){
                    this.startGame();
                    console.log("starting game...");
                    clearInterval(countDown);
                }
            }, 1000);

            this.countDown = countDown;
            
        }
    }

    startGame(){
        let course = buildCourse();
        let pids = [];
        this.players.forEach((socket)=>{
            pids.push(socket.pid)
        });

        this.players.forEach((socket)=>{
            let data = {course: course, pids: pids, selfpid: socket.selfpid};
            socket.emit("startGame", data);
        })
        
        this.state = PLAYING;

        // Make a new object for the next game
        waitingGame = new Game();
    }

    cleanUp(){
        clearInterval(this.tick);
    }
}

function buildCourse(){
    let courses = [];

    // Add easy courses
    for(let i = 0; i < 10; i++){
        let course = Math.round(Math.random() * 3);
        courses.push(course);
    }

    // Add harder courses mixed with ez ones
    for(let i = 0; i < 5; i++){
        let course = Math.round(Math.random() * 5);
        courses.push(course);
    }

    // Add hard courses
    for(let i = 0; i < 5; i++){
        let course = Math.round(Math.random() * 4) + 3;
        courses.push(course);
    }

    // Add finish
    courses.push(8);

    return courses;
}


let waitingGame = new Game();