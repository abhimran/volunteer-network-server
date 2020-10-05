const express = require('express')
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser')
const cors = require('cors');
require("dotenv").config();

const app = express()
app.use(bodyParser.json())
app.use(cors())
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pv2hb.mongodb.net/volunteerNetwork?retryWrites=true&w=majority`;
const port = 5000


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const eventCollection = client.db("volunteerNetwork").collection("event");
  const registerEventCollection = client.db("volunteerNetwork").collection("registerevents");
 app.post('/Addevent', (req, res)=>{
     const event = req.body;
     eventCollection.insertOne(event)
     .then(result=>{
       res.send(result.insertedCount > 0)
     })
 })

 app.get('/events', (req,res)=>{
   eventCollection.find({})
   .toArray((err, documents)=>{
     res.send(documents)
   })
 })

 app.post('/registerevents', (req, res)=>{
     const registerEvent = req.body;
     registerEventCollection.insertOne(registerEvent).then((result) => {
       res.send(result.insertedCount > 0);
     });
 })

 app.get("/allregisterEvents", (req, res) => {
   registerEventCollection.find({email:req.query.email}).toArray((err, documents) => {
     res.send(documents);
   });
 });

 app.get("/alleventsforadmin", (req, res) => {
   registerEventCollection
     .find({})
     .toArray((err, documents) => {
       res.send(documents);
     });
 });

 app.delete('/delete/:id', (req, res)=>{
  registerEventCollection.deleteOne({_id: ObjectId(req.params.id)})
 })
  console.log('Connected');
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)