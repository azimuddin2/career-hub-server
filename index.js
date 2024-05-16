const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const jobsCollection = client.db('careerHub').collection('jobs');
        const applyJobCollection = client.db('careerHub').collection('applyJob');

        // jobs related api
        app.get('/jobs', async (req, res) => {
            const query = {};
            const jobs = await jobsCollection.find(query).toArray();
            res.send(jobs);
        });

        app.get('/job/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobsCollection.findOne(query);
            res.send(result);
        });

        // apply jobs  related api
        app.post('/apply-job', async (req, res) => {
            const applyJobInfo = req.body;
            const result = await applyJobCollection.insertOne(applyJobInfo);
            res.send(result);
        });

        app.get('/apply-job', async (req, res) => {
            const jobFilter = req.query.filter;

            if (jobFilter === 'Remote') {
                const applyJobs = await applyJobCollection.find({ remote_or_onsite: "Remote" }).toArray();
                return res.send(applyJobs);
            }
            else if (jobFilter === 'Onsite') {
                const applyJobs = await applyJobCollection.find({ remote_or_onsite: "Onsite" }).toArray();
                return res.send(applyJobs);
            }
            else {
                const applyJobs = await applyJobCollection.find({}).toArray();
                return res.send(applyJobs);
            }
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