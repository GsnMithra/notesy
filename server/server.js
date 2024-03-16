const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("New noʊtsi connected: " + socket.id);

    socket.on("join-room", (info) => {
        const room = info.room;
        socket.join(room);
        io.to(room).emit("room-joined", `User joined room: ${room}`);
    });

    socket.on("begin-drawing", (data) => {
        socket.to(data.room).emit("begin-drawing", data);
    });

    socket.on("draw", (data) => {
        socket.to(data.room).emit("draw", data);
    });

    socket.on("finish-drawing", (data) => {
        socket.to(data.room).emit("finish-drawing", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected: " + socket.id);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`running on port: ${PORT}`);
});
