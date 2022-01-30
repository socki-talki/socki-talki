#!/usr/bin/env node

// This shebang line feeds the interpreter this file after the "talki" keyword is called in terminal

'use strict';

const readline = require('readline');

const { v4: uuidv4 } = require('uuid');
const colors = require('colors');

const socketioClient = require('socket.io-client');

// const HOST = process.env.HOST || 'http://localhost:3000';
const HOST = 'https://socket-talki.herokuapp.com';
const NAMESPACE = process.env.NAMESPACE || '/socki-talki';

// Variable changes how many recent messages the client can see on inital login
const viewableMessages = 20;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

colors.setTheme({
  server: ['black', 'bgBrightCyan'],
  questions: ['brightGreen'],
  usernames: [assignColor(), 'bold'],
});

let clientName, roomName; // these are assigned when the user inputs their info

//  ======================== Socket Connection =======================
console.log('\n ================ SOCKI-TALKI ================ \n'.server);

rl.question('What is your username? '.questions, (clientNameInput) => {
  rl.question('What room would you like to join? '.questions, (roomNameInput) => {
    clientName = `${clientNameInput}.${uuidv4()}`; // add uuid to client name to keep socket names from clashing
    roomName = roomNameInput.toLowerCase().trim(); // lowercase and trim to ensure clients enter same room.
    // Call function to connect to server
    makeConnection();
  });
});

function makeConnection() {

  //  ======================== Socket Connection =======================

  const socket = socketioClient.connect(`${HOST}${NAMESPACE}`, {
    query: `CustomId=${clientName}`,
  });

  //  ======================== Client Functions ========================

  socket.on('connect', () => {
    // we will put all subscribe and all publish functions below

    console.log(`\n ================ ROOM: ${roomName} ================ \n`.server);
    rl.setPrompt('> '.brightCyan);
    socket.emit('join', roomName);
    rl.prompt();

    socket.on('previous', (messages) => {
      while (messages.length > viewableMessages) {
        messages.shift();
      }
      messages.forEach((message) => {
        console.log(`${message}`);
        rl.prompt();
      });
    });

    socket.on('message', payload => {
      console.log(`${payload.clientName.split('.')[0]}`.usernames, ':', `${payload.message}`.brightWhite);
      rl.prompt();
    });

    // the line event is 'emit' when the user presses 'enter'

    rl.on('line', (message) => {
      if (message.toLowerCase().trim() === 'exit') {
        socket.close();
        process.exit();
      } else {
        socket.emit('message', {
          roomName,
          clientName,
          message,
        });

        rl.prompt();
      }
    });
  });
}

function assignColor() {
  const assignedColor = ['brightRed', 'brightBlue', 'brightMagenta', 'magenta', 'cyan'];
  let randomNum = Math.floor(Math.random() * (assignedColor.length));
  return assignedColor[randomNum];
}

module.exports = makeConnection;