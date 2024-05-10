const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.emptc9i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const categoriesCollection = client.db('careerHub').collection('categories');
        const jobsCollection = client.db('careerHub').collection('jobs');

        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        });

        app.get('/jobs', async (req, res) => {
            const query = {};
            const jobs = await jobsCollection.find(query).toArray();
            res.send(jobs);
        });


    }
    finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Career Hub Server App Runing');
});

app.listen(port, () => {
    console.log(`Career Hub app listening on port ${port}`)
});