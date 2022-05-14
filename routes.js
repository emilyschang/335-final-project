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
        let variables = await mongoUtils.lookup(email);
        if (variables == null) { // variables == null
            // render profile not found page
            response.render("profileNotFound", { email: email });
        } else {
            // update profile with a new dog
            let dogImg = await dogApi.getRandomDog();
            await mongoUtils.update(email, { dogImg: dogImg });

            // get the updated values
            let variables = await mongoUtils.lookup(email);
            console.log(variables);
            response.render("profile");
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
        let variables = await mongoUtils.lookup(email);

        if (variables == null) { // variables == null
            // render profile not found page
            response.render("cancelNotFound", { email: email });
        } else {
            // get the updated values
            result = await mongoUtils.remove(email);
            variables = {
                fname: result.fname,
                lname: result.fname
            }
            console.log(variables);
            response.render("cancelConfirm");
        }
    });
}