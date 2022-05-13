// this is the main file that should be run
// USAGE
// node adoptionServer.js port_number
let fs = require('fs');
let http = require('http');
let path = require("path");
let express = require("express");

process.stdin.setEncoding("utf8");

// verify that the correct number of arguments are running
if (process.argv.length != 3) {
  process.stdout.write(`Usage node adoptionServer.js port_number`);
  process.exit(1);
}

let portNumber = process.argv[2];

// this stuff sets up the routes/templetes
let app = express();
require('./routes.js')(app, portNumber); // the routes have been moved to another server

// run the server
console.log(`Web server started and running at http://localhost:${portNumber}`);
http.createServer(app).listen(portNumber);

// terminates the server when stop is typed into the command line
let prompt = "Stop to shutdown the server: ";
process.stdout.write(prompt);
process.stdin.on("readable", function () {
  let dataInput = process.stdin.read();
  if (dataInput !== null) {
    let command = dataInput.trim();
    if (command === "stop" || command == "Stop") {
      process.stdout.write("Shutting down the server\n");
      process.exit(0);
    } else {
        process.stdout.write(`Invalid command: ${command}\n`);
    }
    process.stdout.write(prompt);
    process.stdin.resume();
  }
});