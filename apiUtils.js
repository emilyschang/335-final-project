/**
 * API UTILS
 * Defines functions that let us interact with the api
 */

const axios = require("axios");

async function getRandomDog() {
    axios.get("https://dog.ceo/api/breeds/image/random")
        .then(res => {
            console.log("Obtained a dog: \n" + res.data);
            return res;
        });
}

module.exports = {getRandomDog};