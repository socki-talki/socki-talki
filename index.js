'use strict';

const socketIo = require('socket.io');
const PORT = process.env.PORT || 3000;
const server = socketIo(PORT);
const uuid = require('uuid').v4;
const colors = require('colors');

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

  sockiTalki.on('join', room => socket.join(room));

  socket.on('message', (messageText, room) => {
    notALogger(messageText);
    sockiTalki.emit('message', messageText);
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

function assignColor() {
  const assignedColor = ['brightRed', 'brightGreen', 'brightYellow', 'brightBlue', 'brightMagenta', 'brightCyan', 'brightWhite'];
  let randomNum = Math.floor(Math.random() * (assignedColor.length));
  return assignedColor[randomNum];
}

function assignBackgropundColor() {
  const assignedBackgroundColor = ['bgBrightRed', 'bgBrightGreen', 'bgBrightYellow', 'bgBrightBlue', 'bgBrightMagenta', 'bgBrightCyan', 'bgBrightWhite', 'bgRed', 'bgGreen', 'bgBlue', 'bgMagenta', 'bgCyan'];
  let randomNum = Math.floor(Math.random() * (assignedBackgroundColor.length));
  return assignedBackgroundColor[randomNum];
}

colors.setTheme({
  server: ['black', 'bgBrightCyan'],
  server2: ['black', 'bgBrightGreen'],
  yours: [assignColor()],
});

console.log('Whats up?!? Check out my fuckin color scheme Bro!!!'.server);
console.log('Whats up?!? Check out my fuckin color scheme Bro!!!'.server2);

let otherUserColors = assignColor();
console.log('Whats up?!? Check out your fuckin color scheme Bro!!!'[otherUserColors]);
