let fs = require('fs');
let http = require('http');
let path = require("path");
let express = require("express");
let mongoUtils = require("./mongoUtils.js");

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

app.use(express.static("templates"));

process.stdin.setEncoding("utf8");
if (process.argv.length != 3) {
  process.stdout.write(`Usage adoptionServer.js`);
  process.exit(1);
}

let portNumber = process.argv[2];

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");


//home
app.get("/", function (request, response) {
    response.render("index");
});

app.get("/adopt", function (request, response) {
  let variables = {
      urlForm: "http://localhost:" +portNumber + "/processAdopt"
  }
  response.render("adopt", variables);
});

app.use(bodyParser.urlencoded({extended:false}));


app.post("/processAdopt", function (request, response) {
  let {
    fname, lname, email, 
    phoneFirstPart, phoneSecondPart, phoneThirdPart,
    state, dname, background} = request.body;
    let variables = {
        fname: fname, 
        lname: lname,
        email: email,
        phoneFirstPart: phoneFirstPart, 
        phoneSecondPart: phoneSecondPart, 
        phoneThirdPart: phoneThirdPart,
        state: state, 
        dname: dname,
        background: background,
        datetime: new Date()
    }
    adopt(variables)
    response.render("adoptConfirm", variables);
});

async function adopt(variables) {
  const uri = `mongodb+srv://${userName}:${password}@cluster0.rm5sq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  try {
      await client.connect();
      let p = {
        fname: variables.fname,
        lname: variables.lname,
        dname: variables.dname,    
        email: variables.email,
        state: variables.state,
        phoneFirstPart: variables.phoneFirstPart, 
        phoneSecondPart: variables.phoneSecondPart, 
        phoneThirdPart: variables.phoneThirdPart, 
        background: variables.background};
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