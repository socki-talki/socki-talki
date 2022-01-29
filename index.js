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

console.log('\n ================ SOCKI-TALKI ================ \n'); 

sockiTalki.on('connection', socket => {
  console.log('SOCKI-TALKI CONNECTION FROM:', socket.id);

  socket.on('disconnect', (reason) => {
    console.log('SOCKI-TALKI DISCONNECTION FROM:', socket.id, 'REASON:', reason);
  });

  socket.on('join', room => socket.join(room));

  socket.on('message', (payload) => {
    let { roomName, message } = payload;
    notALogger(message);
    socket.to(roomName).emit('message', message);
    socket.to(socket.id).emit('message-received');
  });
});

//  ============================================= Helper Functions  =====================================

function notALogger(message) {
  console.log(message);
  messageQueue.addMessage;
}