/**
 * ROUTES
 * Uses express to serve up embeded javascript templates (ejs)
 * This file defines the routes
 */

let fs = require('fs');
let http = require('http');
let path = require("path");
let express = require("express");
const bodyParser = require("body-parser");
const dogApi = require("./apiUtils.js");
let mongoUtils = require("./mongoUtils.js");

module.exports = function (app, portNumber) {
    app.use(express.static("templates"));
    app.set("views", path.resolve(__dirname, "templates"));
    app.set("view engine", "ejs");

    //home
    app.get("/", function (request, response) {
        response.render("index");
    });

    //about
    app.get("/about", function (request, response) {
        response.render("about");
    });

    // adopt home page
    app.get("/adoptHome", function (request, response) {
        response.render("adoptHome");
    });

    // adopt page
    app.get("/adopt", function (request, response) {
        response.render("adopt");
    });

    app.use(bodyParser.urlencoded({ extended: false }));

    app.post("/processAdopt", async function (request, response) {
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
            dogImg: await dogApi.getRandomDog(),
            datetime: new Date()
        }
        mongoUtils.insert(variables);
        response.render("adoptConfirm", variables);
    });

    // status page
    app.get("/status", function (request, response) {
        response.render("status");
    });

    // profile page
    app.post("/profile", async function (request, response) {
        let email = request.body.email;

        // check if entry exists
        let result = await mongoUtils.lookup(email);
        if (result == null) { // variables == null
            // render profile not found page
            response.render("profileNotFound", { email: email });
        } else {
            //update profile with a new dog
            //let dogImg = await dogApi.getRandomDog();
            //await mongoUtils.update(email, { dogImg: dogImg });

            result = await mongoUtils.lookup(email);

            // get the updated values
            let variables = {
                fname: result.fname,
                lname: result.lname,
                email: result.email,
                phoneFirstPart: result.phoneFirstPart,
                phoneSecondPart: result.phoneSecondPart,
                phoneThirdPart: result.phoneThirdPart,
                state: result.state,
                dname: result.dname,
                background: result.background,
                datetime: new Date(),
                dogImg: result.dogImg
            }
            console.log(variables);
            response.render("profile", variables);
        }
    });

    // cancel page
    app.get("/cancel", function (request, response) {
        response.render("cancel");
    });

    // cancel confirmation page
    app.post("/cancelConfirm", async function (request, response) {
        let email = request.body.email;

        // check if entry exists
        let result = await mongoUtils.lookup(email);

        if (result == null) { // variables == null
            // render profile not found page
            response.render("cancelNotFound", { email: email });
        } else {
            // get the updated values

            let variables = {
                fname: result.fname,
                lname: result.lname,
                datetime: new Date()
            }

            result = await mongoUtils.remove(email);

            console.log(variables);
            response.render("cancelConfirm", variables);
        }
    });
}