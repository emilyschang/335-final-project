let path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '.env') })

const { MongoClient, ServerApiVersion } = require('mongodb');

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const db = process.env.MONGO_DB_NAME;
const collection = process.env.MONGO_COLLECTION;

// initialize the database collection
const databaseAndCollection = { db, collection };
const uri = `mongodb+srv://${userName}:${password}@cluster0.rm5sq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// inserts a single element ("data") into the database defined by databaseAndCollection
async function insert(data) {
    console.log("insert:");
    console.log(data);
    try {
        await client.connect();
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(data);
        console.log("inserted");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

// looksup the database for an applicant with given email and returns the result
// if email address was not found, returns null
async function lookup(email) {
    console.log("lookup: " + email);
    try {
        await client.connect();
        let filter = { email: email };
        const result = await client
            .db(databaseAndCollection.db)
            .collection(databaseAndCollection.collection)
            .findOne(filter);
        if (result) { // a result was found
            console.log(result);
            return result;
        } else { // result was not found
            console.log(`No applicant found with email ${email}`);
            return null;
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    } 
}

// updates the entry given by targetEmail with newValues
async function update(targetEmail, newValues) {
    console.log("update: " + email);
    try {
        let filter = {email : targetEmail};
        let update = { $set: newValues };
    
        const result = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .updateOne(filter, update);
    
        console.log(`Documents modified: ${result.modifiedCount}`);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

module.exports = {insert, lookup, update};