

const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');
var usersConnections = []
var  usersConnectionsCounter = []

var gIo = null
var gSocketBySessionIdMap = {} 

function connectSockets(http, session) {
    gIo = require('socket.io')(http);

    const sharedSession = require('express-socket.io-session');

    gIo.use(sharedSession(session, {
        autoSave: true
    }));
    gIo.on('connection', socket => {
        console.log('New socket - socket.handshake.sessionID 2', socket.handshake.sessionID)
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket
        // TODO: emitToUser feature - need to tested for CaJan21
        // if (socket.handshake?.session?.user) socket.join(socket.handshake.session.user._id)
        socket.on('disconnect', socket => {
            console.log('Someone disconnected',socket)
            if (socket.handshake) {
                gSocketBySessionIdMap[socket.handshake.sessionID] = null
            }
        })
        
        socket.on('user-disconnect', user => {
            let isContainUser =  usersConnectionsCounter.some((userToFind)=>{
                return (user._id === userToFind._id)
            })
        
            if(isContainUser){
                var userToRemove = usersConnectionsCounter.filter((userToFind)=>{
                    return (user._id === userToFind._id)
                })
             /// console.log('userToRemove on app',userToRemove)
                var indexToRemove =  usersConnectionsCounter.indexOf(userToRemove[0])
                usersConnectionsCounter.splice(indexToRemove,1)
            }
                isContainUser =  usersConnectionsCounter.some((userToFind)=>{
                return (user._id === userToFind._id)
            })
            if(!isContainUser){
                
                isContainUser =  usersConnections.some((userToFind)=>{
                    return (user._id === userToFind._id)
                })
             // if the user is not exist on the usersConnectionsCounter list but exist in the usersConnections  list , so there is no such user login anymore and he should be remove
            if(isContainUser){   
                userToRemove = usersConnections.filter((userToFind)=>{
                    return (user._id === userToFind._id)
                })
                indexToRemove =  usersConnections.indexOf(userToRemove[0])
                usersConnections.splice(indexToRemove,1)
            }
            
            }
            socket.broadcast.emit('user-has-disconnect', usersConnections)
        })
        socket.on('chat newMsg', msg => {
          //  console.log('chat newMsg ',msg)
            // emits to all sockets:
            // socket.broadcast.emit("0", msg)
         //   gIo.emit("msg-chat", msg)
            //   gIo.emit(msg._id, msg)
            // gIo.emit('chat addMsg', msg)
            // emits only to sockets in the same room
            //gIo.to(socket.myTopic).emit('chat addMsg', msg)
        })
        socket.on('multi-chat', msg => {
            console.log('in multi-chat , the message :',msg)
            msg.toUsers.forEach(user => {
            socket.broadcast.emit(`${user._id}`, msg)
        });
           //socket.broadcast.emit(`${msg.toId}`, msg)
        })
        socket.on('user-connected-details', user => {
        console.log('user-connected details:',user.fullname)
            socket.broadcast.emit("user-now-connected", user)
                console.log('usersConnections',usersConnections) 
                const ans = usersConnections.some(oldUser=>{
                        return (oldUser._id===user._id )
                })
                    if(!ans) {
                        usersConnections.push(user)
                    }
            usersConnectionsCounter.push(user)
            socket.emit('updateLoginUser',user)
            socket.emit('usersConnections', usersConnections)
         //   console.log('usersConnections',usersConnections)
        })
        socket.on('user-watch', userId => {
            socket.join(userId)
        })
    })
}

function emitToAll({ type, data, room = null }) {
    if (room) gIo.to(room).emit(type, data)
    else gIo.emit(type, data)
}

// TODO: Need to test emitToUser feature
function emitToUser({ type, data, userId }) {
    gIo.to(userId).emit(type, data)
}


// Send to all sockets BUT not the current socket 
function broadcast({ type, data, room = null }) {
    const store = asyncLocalStorage.getStore()
    const { sessionId } = store
    if (!sessionId) return logger.debug('Shoudnt happen, no sessionId in asyncLocalStorage store')
    const excludedSocket = gSocketBySessionIdMap[sessionId]
    if (!excludedSocket) return logger.debug('Shouldnt happen, No socket in map')
    if (room) excludedSocket.broadcast.to(room).emit(type, data)
    else excludedSocket.broadcast.emit(type, data)
}


module.exports = {
    connectSockets,
    emitToAll,
    broadcast,
}



