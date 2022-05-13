let fs = require('fs');
let http = require('http');
let path = require("path");
let express = require("express");
const bodyParser = require("body-parser");

// to save us all some sanity from reading a file that's 2000 lines long, let's use this
let mongoUtils = require("./mongoUtils.js");

// plz get rid of this D:
require("dotenv").config({ path: path.resolve(__dirname, '.env') }) // :(
const { MongoClient, ServerApiVersion } = require('mongodb');

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const db = process.env.MONGO_DB_NAME;
const collection = process.env.MONGO_COLLECTION;
const databaseAndCollection = { db, collection };

module.exports = function (app, portNumber) {
    app.use(express.static("templates"));
    app.set("views", path.resolve(__dirname, "templates"));
    app.set("view engine", "ejs");

    //home
    app.get("/", function (request, response) {
        response.render("index");
    });

    // adopt page
    app.get("/adopt", function (request, response) {
        let variables = {
            urlForm: "http://localhost:" + portNumber + "/processAdopt"
        }
        response.render("adopt", variables);
    });

    app.use(bodyParser.urlencoded({ extended: false }));

    app.post("/processAdopt", function (request, response) {
        let {
            fname, lname, email,
            phoneFirstPart, phoneSecondPart, phoneThirdPart,
            state, dname, background } = request.body;
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
}

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
            background: variables.background
        };
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(p);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}