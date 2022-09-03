const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const issuesCollection = client.db("IssueTrack").collection("issueTest");
    const meetingCollection = client.db("IssueTrack").collection("meeting");
    const usersCollection = client.db("IssueTrack").collection("users");
    const feedbackCollection = client.db("IssueTrack").collection("feedback");

    // // get all project list api
    // app.get("/projects", async (req, res) => {
    //   const query = {};
    //   const cursor = projectsCollection.find(query);
    //   const projects = await cursor.toArray();
    //   res.send(projects);
    // });

    // get a single project
    app.get("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await projectsCollection.findOne(query);
      res.send(result);
    });

    // app.get("/invitedProjects/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = {};
    //   const projects = await projectsCollection.find();
      
    //   res.send(projects);
    // });

    // get all project
    app.get('/projects',  async(req,res) =>{
      const email = req.query.email;
      console.log(email);
      if(email){
         const query = {email: email};
      
         const project = await projectsCollection.find(query).toArray();
          res.send(project);
      }
      else{
          return res.status(403).send({message: 'forbidden access'})
      }
     
  });


  // get invitedTeam
  app.get('/invitedTeam/:email', async(req,res) =>{
    const email = req.params.email;
    const query = {};
    const projects = await projectsCollection.find(query).toArray();
    const invitedProjects = []
    projects.map(project => {
      project?.member?.map(e => {
        if(e === email){
          invitedProjects.push(project)
        }
      })
    })
    res.send(invitedProjects)
  })


//   app.get('/projects',  async(req,res) =>{
//     const email = req.query.email;
//     let allProject = []
//     if(email){
//        const query = {email: email};
//     const all = {}
//        const project = await projectsCollection.find(query).toArray();
//        const ap = await projectsCollection.find(all).toArray();
//         // res.send(project);
//         allProject= [...project]
//         ap.map(s => {
//           s?.member?.map( e =>{
//             console.log(s)
//             if(e === email){
//               allProject = [...allProject,s]
//             }
//             res.send(allProject)
//           })
//         })
//     }
//     else{
//         return res.status(403).send({message: 'forbidden access'})
//     }
   
// });

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

    // get myIssues
    app.get('/myIssues',  async(req,res) =>{
      const email = req.query.email;
      console.log(email);
      if(email){
         const query = {email: email};
      
         const issues = await issuesCollection.find(query).toArray();
          res.send(issues);
      }
      else{
          return res.status(403).send({message: 'forbidden access'})
      }
    })


  // get projectIssues
    app.get("/projectIssues/:id", async (req, res) => {
      const proId = req.params.id;
      const query = {projectId : proId};
      const cursor = issuesCollection.find(query);
      const projects = await cursor.toArray();
      res.send(projects);
    });


    // get single issue
    app.get("/issues/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await issuesCollection.findOne(query);
      res.send(result);
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
      console.log(id);
      const issue = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateIssue = {
        status: issue
      }
      const updateDoc = {
        $set: updateIssue,
      };
      const result = await issuesCollection.updateOne(filter, updateDoc, options );
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
      const meetings = await cursor.toArray();
      res.send(meetings);
    });

    // post Meeting
    app.post("/meeting", async (req, res) => {
      const meeting = req.body;
      const result = await meetingCollection.insertOne(meeting);
      return res.send({ success: true, result });
    });


    // delete meeting API
    app.delete("/meeting/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await meetingCollection.deleteOne(query);
      res.send(result);
    });


    // post feedback
    app.post("/feedback", async (req, res) => {
      const feedback = req.body;
      const result = await feedbackCollection.insertOne(feedback);
      return res.send({ success: true, result });
    });


    // get Meeting
    app.get("/feedback", async (req, res) => {
      const query = {};
      const cursor = feedbackCollection.find(query);
      const feedback = await cursor.toArray();
      res.send(feedback);
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
