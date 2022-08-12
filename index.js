const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5001;

// middleware
app.use(cors());
app.use(express.json());

// monogdb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@singlecluster.mk2uv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("MongoDB Connected");
    const projectsCollection = client.db("IssueTrack").collection("projects");
    const issuesCollection = client.db("IssueTrack").collection("issues");
    const meetingCollection = client.db("IssueTrack").collection("meeting");

    // get all project list api
    app.get("/projects", async (req, res) => {
      const query = {};
      const cursor = projectsCollection.find(query);
      const projects = await cursor.toArray();
      res.send(projects);
    });

    // post Project
    app.post("/projects", async (req, res) => {
      const project = req.body;
      const result = await projectsCollection.insertOne(project);
      return res.send({ success: true, result });
    });

    // delete Project API
    app.delete("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await projectsCollection.deleteOne(query);
      res.send(result);
    });

    // get all issue list api
    app.get("/issues", async (req, res) => {
      const query = {};
      const cursor = issuesCollection.find(query);
      const projects = await cursor.toArray();
      res.send(projects);
    });

    // post issue
    app.post("/issues", async (req, res) => {
      const project = req.body;
      const result = await issuesCollection.insertOne(project);
      return res.send({ success: true, result });
    });

    // update issue API
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const issue = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: issue,
      };
      const result = await issuesCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete Issue API
    app.delete("/issues/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await issuesCollection.deleteOne(query);
      res.send(result);
    });

    // update issue api
    app.put("/issues/:id", async (req, res) => {
      const id = req.params.id;
      const issue = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: issue,
      };
      const result = await issuesCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // get Meeting
    app.get("/meeting", async (req, res) => {
      const query = {};
      const cursor = meetingCollection.find(query);
      const projects = await cursor.toArray();
      res.send(projects);
    });

    // post Meeting
    app.post("/meeting", async (req, res) => {
      const project = req.body;
      const result = await meetingCollection.insertOne(project);
      return res.send({ success: true, result });
    });
    // delete meeting API
    app.delete("/meeting/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await meetingCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Issue Tracker!");
});

app.listen(port, () => {
  console.log(`Issue Tracker Server app listening on port ${port}`);
});
