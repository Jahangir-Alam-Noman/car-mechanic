const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.veusr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("genius_Mechanic");
        const usersCollection = database.collection("services");

        // get api 
        app.get('/services', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })

        // get for single service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.findOne(query);
            res.json(result);
        })


        // post api 
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await usersCollection.insertOne(service);
            console.log('hitted the post', result);
            res.json(result);
        })

        // delete api 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        })


    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);





app.get('/', (req, res) => {
    console.log('hitted the get');
    res.send('Hello I am from Node');
})

app.listen(port, () => {
    console.log('listening the port', port);
})