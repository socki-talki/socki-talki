'use strict';

// Require our linked list implementation
const { messageQueue, notALogger, returnDay } = require('../index.js');

describe('Server side testing ', () => {

  it('Can properly add a room, assuming a new connection is made with a room name ', () => {
    messageQueue.addRoom('testRoomName');

    let day = returnDay();

    expect(messageQueue.prevMessages[day]['testRoomName']).toBeDefined();
  });

  it('Can successfully save a new message to the messageQueue', () => {
    messageQueue.addMessage('testRoomName', 'test message');

    let day = returnDay();

    expect(messageQueue.prevMessages[day]['testRoomName'][0]).toBe('test message');
  });

  it('Will log and add a message to the messageQueue when notALogger is called', () => {
    jest.spyOn(console, 'log');

    let day = returnDay();

    notALogger('testRoomName', 'test message 2', 'testClient');

    expect(messageQueue.prevMessages[day]['testRoomName'][1]).toBe('testClient: test message 2');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

});
