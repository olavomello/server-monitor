const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cluster = require('cluster');
const OS = require('os');

// Server info
const hostName = OS.hostname;
const numCPUs = OS.cpus().length;
const numMem = OS.freemem;
const numUpTime = OS.uptime;
const strPlataform = OS.platform;
const PORT = 3000;

// Vars
var strFullLog = "";

var clients = {}; 

// Function log
function log( strLog ){
    console.log(strLog);
    //strFullLog +=   `${strLog}\n`;
}

if (cluster.isMaster) {
    // Main cluster
    log(`---------------------------------------`);
    log(`              MONITORING               `);
    log(`---------------------------------------`);
    log(`Master ${process.pid} is running`);
    log(`Host : ${hostName}`);
    log(`CPUs : ${numCPUs}`);
    log(`Memory : ${numMem} bytes`);
    log(`UpTime : ${numUpTime} secs`);
    log(`Platform : ${strPlataform}`);
    log(`---------------------------------------`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();  
    }

    // Online
    cluster.on('online', (worker, code, signal) => {
        log(`Cluster ${worker.process.pid} is online`);
    });
    // Offline
    cluster.on('disconnect', (worker, code, signal) => {
        log(`Cluster ${worker.process.pid} is offline`);
    });   
    // On exit
    cluster.on('exit', (worker, code, signal) => {
        log(`Cluster ${worker.process.pid} died`);
    });
} else {
    // Clusters / Threads
    http.listen(PORT, function(){
        
    });
}

// Routes
app.get('/', function(req, res){
    res.send('server is running');
});
io.on("connection", function (client) {  
    console.log("New connection");
    
    // ----------------------------------------------
    // Send commands to clients
    // ----------------------------------------------
    // Join
    client.on("join", function(name){
        console.log("Joined: " + name);
        clients[client.id] = name;
        client.emit("update", "Connected.");
        client.broadcast.emit("update", name + " has joined the server.")
    });
    // Send
    client.on("send", function(msg){
        console.log("Message: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });
    // Disconect
    client.on("disconnect", function(){
        console.log("Disconnect");
        io.emit("update", clients[client.id] + " has left the server.");
        delete clients[client.id];
    });
    // ----------------------------------------------
});


// 
console.log(`Server listen on port : ${PORT}`);