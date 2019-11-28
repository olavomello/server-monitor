const cluster       =   require('cluster');
const http          =   require('http');
const OS            =   require('os');

// Server info
const hostName      =   OS.hostname;
const numCPUs       =   OS.cpus().length;
const numMem        =   OS.freemem;
const numUpTime     =   OS.uptime;
const strPlataform  =   OS.platform;

if (cluster.isMaster) {
    // Main cluster
    console.log(`---------------------------------------`);
    console.log(`              MONITORING               `);
    console.log(`---------------------------------------`);
    console.log(`Master ${process.pid} is running`);
    console.log(`Host : ${hostName}`);
    console.log(`CPUs : ${numCPUs}`);
    console.log(`Memory : ${numMem} bytes`);
    console.log(`UpTime : ${numUpTime} secs`);
    console.log(`Platform : ${strPlataform}`);
    console.log(`---------------------------------------`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();  
    }

    // Online
    cluster.on('online', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} is online`);
    });
    // Online
    cluster.on('disconnect', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} is offline`);
    });    

    // On exit
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
  
    http.createServer((req, res) => {
        // Print infos
        res.writeHead(200);
        res.end('hello world\n');
  }).listen(8000);

  // Infos
  console.log(`Worker ${process.pid} started`);
}