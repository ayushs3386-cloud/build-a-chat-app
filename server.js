import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;

const server = http.createServer( (req,res)=> {
fs.readFile("./public/index.html",(err,data)=> {

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
})
})

const wss = new WebSocketServer({server});

wss.on('connection', (socket,req) => {
    const  username = new URL(req.url, "http://localhost").searchParams.get("username")

    socket.on('close',()=> {
        wss.clients.forEach((client)=> client.send(JSON.stringify({type: 'system', text: `${username} left`})))
    })

    socket.on('message',(data)=> {
        try {
             const parsedData = JSON.parse(data);
             const {text} = parsedData;
             wss.clients.forEach((client) => {
                
                    client.send(JSON.stringify({type:'chat', username, text}))
                
                
            });
        }
        catch (err) {
            console.error("Error",err);
        }
       
    });
})

server.listen(PORT, ()=> {
    console.log("Chat server running at http://localhost:3001");
})
