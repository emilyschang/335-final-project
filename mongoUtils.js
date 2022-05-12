let http = require('http');
let path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '.env') }) 
const { MongoClient, ServerApiVersion } = require('mongodb');

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const db = process.env.MONGO_DB_NAME;
const collection = process.env.MONGO_COLLECTION;

const databaseAndCollection = {db, collection};

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