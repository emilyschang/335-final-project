/**
 * API UTILS
 * Defines functions that let us interact with the api
 */

const axios = require("axios");

async function getRandomDog() {
    let res = await axios.get("https://dog.ceo/api/breeds/image/random")
    console.log("Obtained a dog: \n" + res.data.message);
    return res.data.message;
}

module.exports = {getRandomDog};