const cluster       =   require('cluster');
const http          =   require('http');
const OS            =   require('os');

// Server info
const hostName      =   OS.hostname;
const numCPUs       =   OS.cpus().length;
const numMem        =   OS.freemem;
const numUpTime     =   OS.uptime;
const strPlataform  =   OS.platform;

// Vars
var strFullLog      =   "";

// Function log
function log( strLog ){
    console.log(strLog);
    strFullLog +=   strLog;
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
        log(`worker ${worker.process.pid} is online`);
    });
    // Online
    cluster.on('disconnect', (worker, code, signal) => {
        log(`worker ${worker.process.pid} is offline`);
    });   
    // On exit
    cluster.on('exit', (worker, code, signal) => {
        log(`worker ${worker.process.pid} died`);
    });
} else {
  
    http.createServer((req, res) => {
        // Print infos
        //res.writeHead(200, {"Content-Type": "text/plain"});
        res.writeHead(200);
        res.end(strFullLog);
    }).listen(8000);

  // Infos
  // console.log(`Worker ${process.pid} started`);
}