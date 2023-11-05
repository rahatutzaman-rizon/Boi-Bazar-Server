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
const  uri = "mongodb://redwantamim525:h8Jk5lP0J1WgYdCi@ac-7qfszrw-shard-00-00.hheptki.mongodb.net:27017,ac-7qfszrw-shard-00-01.hheptki.mongodb.net:27017,ac-7qfszrw-shard-00-02.hheptki.mongodb.net:27017/?ssl=true&replicaSet=atlas-13fbk7-shard-0&authSource=admin&retryWrites=true&w=majority";



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
    const booksCollection = client.db('booksdb').collection('bookss');

    

    const mycart=client.db('mycart').collection('cart');



    app.post('/product', async(req,res)=>{
        const newProduct = req.body;
       console.log(newProduct);
       const result = await productCollection.insertOne(newProduct);
       res.send(result);
    })

    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id=req.params.id;
     const query={
      _id : new ObjectId(id)
     }
      const result = await productCollection.findOne(query) ;
      res.send(result);
    });



    app.post('/cart', async(req,res)=>{
      const newcart = req.body;
     
     const result = await mycart.insertOne(newcart);
     res.send(result);
  })

  app.get("/cart", async (req, res) => {
    const cursor = mycart.find();
    const result = await cursor.toArray();
    res.send(result);
  });


  app.put('/product/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const options = { upsert: true };
    const update = req.body;
    // name, brand,rating,description, category,photo,price
    const productupdate = {
        $set: {
            name: update.name,
            brand:update.brand,
            rating: update.rating,
            description: update.description,
            category: update.category,
            price: update.price,
            photo: update.photo
        }
    }

    const result = await productCollection.updateOne(filter, 
      productupdate, options);
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
