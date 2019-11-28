$(document).ready(function(){  
    var socket = io.connect("http://localhost:3000");
    var ready = false;

    // Join
    ready = true;
    socket.emit("join", "Olavo");
	socket.emit("send", "Entrei...");

    socket.on("update", function(msg) {
    	$("#main").append('<li class="info">' + msg + '</li>')
    }); 

    socket.on("chat", function(client,msg) {
        var time = new Date();
        $("#main").append('<li class="field"><div class="msg"><span>' + client + ':</span><p>' + msg + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
    });
});