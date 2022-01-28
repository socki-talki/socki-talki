'use strict';

const socketIo = require('socket.io');
const PORT = process.env.PORT || 3000;
const server = socketIo(PORT);
const uuid = require('uuid').v4;

const sockiTalki = server.of('/socki-talki');

//  ============================================= Queue  =============================================

const messageQueue = {
  prevMessages: {
    room: '',
    id: uuid(),
    message: '',
  },
};

//============================================= middleware =============================================

sockiTalki.use((socket, next) => {
  const obj = JSON.parse(JSON.stringify(socket.handshake.query));
  const name = obj.CustomId;
  socket.id = name;
  next(null, true);
});

//============================================= sockiTalki =============================================

sockiTalki.on('connection', socket => {
  console.log('SOCKI-TALKI CONNECTION FROM:', socket.id);

  socket.on('disconnect', (reason) => {
    console.log('SOCKI-TALKI DISCONNECTION FROM:', socket.id, '\nREASON:', reason);
  });

  socket.on('join', room => socket.join(room));
  // console.log(`👽 ~ file: index.js ~ line 39 ~ room`, room);

  socket.on('message', (payload) => {
    let { roomName, message } = payload;
    // console.log(`👽 ~ file: index.js ~ line 41 ~ socket.on ~ room`, payload.roomName);
    // console.log(`👽 ~ file: index.js ~ line 41 ~ socket.on ~ room`, roomName);
    notALogger(message);
    sockiTalki.to(roomName).emit('message', message);
    sockiTalki.to(socket.id).emit('message-received');

    // if(!room) {
    //   socket.broadcast.emit(`Everyone listen up, ${messageText}`);
    // } else {
    //   sockiTalki.to(room).emit('message', messageText);
    // }
  });
});

//  ============================================= Helper Functions  =====================================

function notALogger(message) {
  console.log(message);
  messageQueue.addMessage;
}