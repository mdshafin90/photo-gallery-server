// express js for my server side
const express = require('express');

// for environment variable
require('dotenv').config();

// for connecting server with client side
const cors = require('cors');
const app = express();

// connection with mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// port declaration for running of server
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb uri start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9adrrgz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // mongodb collection name
        const photoCollection = client.db("photoGallery").collection("photos");

        // get the collection
        app.get('/photos', async (req, res) => {
            const cursor = photoCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // get the specific fruit from the database
        app.get('/photos/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await photoCollection.findOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// to run my sever
app.get('/', (req, res) => {
    res.send('Photo gallery server is running')
});

// listening the port
app.listen(port, () => {
    console.log(`Photo gallery server is running on port: ${port}`)
});