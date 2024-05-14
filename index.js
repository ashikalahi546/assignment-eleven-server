const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT ||8360;
require("dotenv").config();

// middleware
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://react-email-form.web.app",
//       "https://react-email-form.firebaseapp.com",
//     ],
//     credentials: true,
//   })
// );
app.use(cors());
app.use(express.json({limit:'20MB'}));

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lbnjpl6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const createAssignment = client.db("crud11").collection("create");

    // get all jobs  data from db

    app.get("/create", async (req, res) => {
      const result = await createAssignment.find().toArray();
      res.send(result);
    });

    /// single id jonno
    app.get("/create/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: new ObjectId(id) };
      const service = await createAssignment.findOne(cursor);
      res.send(service);
    });

    //post data
    app.post("/create", async (req, res) => {
      const assignment = req.body;
      console.log(assignment);
      const result = await createAssignment.insertOne(assignment);
      res.send(result);
    });

    // delete
    app.delete("/create/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await createAssignment.deleteOne(query);
      res.send(result);
    });

    //all update
    app.put("/create/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateAll = req.body;
      const update = {
        $set: {
          title: updateAll.title,
          image: updateAll.image,
          level: updateAll.level,
          deadline: updateAll.deadline,
          mark: updateAll.mark,
          description: updateAll.description,
        },
      };

      const result = await createAssignment.updateOne(filter, update);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
