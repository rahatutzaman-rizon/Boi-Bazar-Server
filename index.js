const express = require('express');
const cors = require('cors');
const app = express();

//mongodb
 const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
 require('dotenv').config()
 const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




//password: h8Jk5lP0J1WgYdCi
const uri = "mongodb+srv://redwantamim525:h8Jk5lP0J1WgYdCi@cluster0.jkkcmls.mongodb.net/?retryWrites=true&w=majority";



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

    ///create a collection of documents
    const booksCollection = client.db('booksInventory').collection('books');

////insert a book post 
 app.post('/upload-book',async(req,res)=>{

  const data=req.body;

  //
  const result=await booksCollection.insertOne(data);
  console.log(result)
  res.send(result);
 })


 ///MOREdetail a book

 app.get("/moredetail/:id", async (req, res) => {
  const id=req.params.id;
 const query={
  _id : new ObjectId(id)
 }
  const result = await booksCollection.findOne(query) ;
  res.send(result);
});


 //find to get

//  app.get('/all-books',async(req,res)=>{

//   const books=booksCollection.find();

//   const result=await books.toArray();

//   res.send(result);
//  })


////query
app.get('/all-books',async(req,res)=>{

 let query={};
 if(req.query?.category){
  query={category: req.query.category}
 }
 const result= await booksCollection.find(query).toArray();


  res.send(result);
 })


 ///update a books
 app.patch("/book/:id", async(req,res)=>{

  const id=req.params.id;
const updateBooksData=req.body;
const filter ={ _id :new ObjectId(id)};


const updateDoc = {
  $set: updateBooksData // No need to spread the 'updateBooksData' since it's already an object
};
const options = { upsert: true };

const result=await booksCollection.updateOne(filter,updateDoc,options);

  res.send(result)
 })
    
//delete a book
app.delete("/book/:id", async(req,res)=>{

  const id=req.params.id;

const filter ={ _id :new ObjectId(id)};
const result= await booksCollection.deleteOne(filter)
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



app.get('/',async(req,res)=>{
    res.send('server is running')
})

app.listen(port,()=>{
    console.log(port);
})
