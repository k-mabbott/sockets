
const express = require("express");
const app = express();
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT;
    
require("./config/mongoose.config");
    
app.use(cors())
app.use(express.json(), express.urlencoded({ extended: true }), cors());
    
// const AllMyUserRoutes = require("./routes/user.routes");
// AllMyUserRoutes(app);
    
const server = app.listen(port, () => console.log(`Listening on port: ${port}`) );

// To initialize the socket, we need to
// invoke the socket.io library
// and pass it our Express server
const io = require('socket.io')(server, { cors: true });

app.get( '/', (req,res) => {
    res.json('Hello World')
})
app.get( '/api/test', (req,res) => {
    res.json('Hello')
})

io.on('connection', socket => {
    //Each client gets their own socket id
    console.log(`Client ${socket.id} has connected`)
    console.log('Nice to meet you. (Shake hand)')
    
    socket.emit('Welcome', socket.id)

    socket.on('message_from_client', data => {
        // console.log(`Client ${socket.id} sent ${data}`)
        io.emit('message_posted', data)
    })
    // if this is logged in our terminal that means a new client has 
    //joined / completed the handshake.
    //add all event listeners
    // "connection" is a BUILT IN event listener
    socket.on('event_from_client', data => {
        socket.broadcast.emit('send_data_to_all_other_clients', data)
    });
});
