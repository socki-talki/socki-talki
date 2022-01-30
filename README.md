# socki-talki

socki-talki deployed on Heroku.

Deployment URL: https://socket-talki.herokuapp.com

![Data Flow](/UML.jpg)

## Installation

to install run `git@github.com:socki-talki/socki-talki.git`

run `npm install`

## Usage

To start server run: `npm start`

To test server run: `npm test`

## Routes

https://socket-talki.herokuapp.com/socki-talki

## Features

* Style:
  * Used `colors.JS` to add the terminal coloring.
  * There are five easy to read color scheme that users will randomly receive upon logging in.

* Username:
  * Ability to create your own username without worry of it already being taken.

* Room:
  * Select what room you want to start chatting in or just enter nothing to enter public chat.

* Messages:
  * Messages are passed through `socket.io` and instantly displayed on other users terminal.
  * Past two days of messages are saved to the server and displayed when entering a room so you're never left out of the conversation.

## Created by:

- **Kellen Linse:** https://github.com/Kellen-Linse
- **Keian Anthony:** https://github.com/Keian-A
- **Daniel Jackson:** https://github.com/daniel-jacks
- **Micheal Metcalf:** https://github.com/Metty82