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
    // get all issue list api
    app.get("/issues", async (req, res) => {
      const query = {};
      const cursor = issuesCollection.find(query);
      const projects = await cursor.toArray();
      res.send(projects);
    });

    app.get("/meeting", async (req, res) => {
      const query = {};
      const cursor = meetingCollection.find(query);
      const projects = await cursor.toArray();
      res.send(projects);
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
