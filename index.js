'use strict';

const socketIo = require('socket.io');
const PORT = process.env.PORT || 3000;
const server = socketIo(PORT);

const sockiTalki = server.of('/socki-talki');

//  ============================================= Queue  =============================================

const messageQueue = {
  prevMessages: {},

  // this is called whenever a message is sent, and saves that message within the room
  addMessage: function (nameOfRoom, message) {

    let day = returnDay();

    let arrayToAdd = this.prevMessages[day][nameOfRoom] ? this.prevMessages[day][nameOfRoom] : this.prevMessages[day][nameOfRoom] = [];

    arrayToAdd.push(message);
    console.log(this.prevMessages);
  },

  // this is called whenever a new room is created by a user
  addRoom: function (nameOfRoom) {
    let day = returnDay();

    if (!this.prevMessages[day]) {
      this.prevMessages[day] = {};
    }

    if (!this.prevMessages[day][nameOfRoom]) {
      this.prevMessages[day][nameOfRoom] = [];
    }
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

  socket.on('join', room => {
    messageQueue.addRoom(room);
    console.log(messageQueue.prevMessages);
    socket.join(room);
  });

  socket.on('message', (payload) => {

    notALogger(payload.roomName, payload.message, payload.clientName);
    
    socket.to(payload.roomName).emit('message', payload);

    socket.to(socket.id).emit('message-received');
  });
});

//  ============================================= Helper Functions  =====================================

function notALogger(nameOfRoom, message, clientName) {
  console.log(`Roomname: ${nameOfRoom}`);
  clientName = clientName.split('.')[0];
  messageQueue.addMessage(nameOfRoom, `${ clientName }: ${ message }`);
}

function returnDay() {
  const date = new Date();
  let day = date.getDay();
  return day;
}

function bringDownTheHammer() {
  let day = returnDay();
  let value = day - 2;

  switch (day) {
    case 0:
      messageQueue.prevMessages['5'] = {};
      break;
    case 1:
      messageQueue.prevMessages['6'] = {};
      break;
    default:
      messageQueue.prevMessages[value] = {};
      break;
  }
}

setInterval(() => bringDownTheHammer(), 43200000);

