let fs = require('fs');
let http = require('http');
let path = require("path");
let express = require("express");

require("dotenv").config({ path: path.resolve(__dirname, '.env') }) 
const { MongoClient, ServerApiVersion } = require('mongodb');

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const db = process.env.MONGO_DB_NAME;
const collection = process.env.MONGO_COLLECTION;

const databaseAndCollection = {db, collection};

let app = express();
let bodyParser = require("body-parser");
const e = require('express');


process.stdin.setEncoding("utf8");

if (process.argv.length != 3) {
  process.stdout.write(`Usage summerCampServer.js`);
  process.exit(1);
}

let portNumber = process.argv[2];


app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

//home
app.get("/", function (request, response) {
    response.render("index");
});


app.use(bodyParser.urlencoded({extended:false}));
app.post("/processApplication", function (request, response) {
    let {} = request.body;
    let variables = {
        
    }
    apply(variables);
    response.render("appConfirmation", variables);
});

async function apply(variables) {
    const uri = `mongodb+srv://${userName}:${password}@cluster0.rm5sq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();
        let p = {name: variables.name, email: variables.email, gpa: variables.gpa, background: variables.background};
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(p);
        
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}



console.log(`Web server started and running at http://localhost:${portNumber}`);
http.createServer(app).listen(portNumber);

let prompt = "Stop to shutdown the server: ";
process.stdout.write(prompt);
process.stdin.on("readable", function () {
  let dataInput = process.stdin.read();
  if (dataInput !== null) {
    let command = dataInput.trim();
    if (command === "stop") {
      process.stdout.write("Shutting down the server\n");
      process.exit(0);
    } else {
        process.stdout.write(`Invalid command: ${command}\n`);
    }
    process.stdout.write(prompt);
    process.stdin.resume();
  }
});