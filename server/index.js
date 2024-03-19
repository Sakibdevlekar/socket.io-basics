import express  from "express";
import {createServer} from "http";
import {Server}  from "socket.io";
import cors from "cors";
const app = express();
const server = createServer(app);
const port = 3300;
app.use(cors());

const io = new Server(server,{
    cors:{
       origin:"*",
       credentials:true,
       methods:["GET,POST"]
    }
});

app.get('/', (req, res)=>{
    res.send('Hello World');
});

const user = true
io.use((socket,next)=>{
    if (user) next()
})

io.on('connection', (socket)=>{
    // console.log('====================================');
    // console.log('A user connected');
    // console.log(socket.id);
    // io.emit('msg','hello world');
    // console.log('====================================');
    // socket.on('disconnect', ()=>{
    //     console.log('====================================');
    //     console.log('A user disconnected');
    //     console.log('====================================');
    // });
    socket.on('message', ({message})=>{
        // console.log(message);
        io.to(message.roomName).emit('received-message',message.message);
    });
    socket.on('join-room', (room)=>{
        // console.log(room);
        socket.join(room);
    });
});

server.listen(port,()=>{
    console.log('====================================');
    console.log(`Server listening on:${port}`);
    console.log('====================================');
});