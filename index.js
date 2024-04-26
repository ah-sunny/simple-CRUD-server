const exprss = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = exprss();
const cors = require('cors');
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(exprss.json())
//pass :arafatFirstTest01


const uri = "mongodb+srv://firstTestPart01:arafatFirstTest01@cluster0.sy54hal.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        // Get the database and collection on which to run the operation
        const db = client.db("UserDB");
        const userCollection = db.collection("user");

        app.get('/users', async(req,res)=>{
            const data = userCollection.find()
            const userData = await data.toArray()
            res.send(userData)
        })
        // app.get('/users/:id', async(req,res)=>{
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const user = await userCollection.findOne(query)
        //     // console.log("single id:",user)
        //     res.send(user)
        // })
        app.get('/users/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const user = await userCollection.findOne(query);
            res.send(user);
        })
    
       

        app.post('/users', async (req, res) => {
            const user = req.body
            // console.log('post',user)
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        app.delete('/users/:id',async(req,res)=>{
            const id = req.params.id;
            console.log('delete :',id)
            // const query = { _id: new ObjectId(id)}
            const query= { _id: new ObjectId(id)}
            const deleteResult = await userCollection.deleteOne(query)
            res.send(deleteResult)
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



app.get('/', (req, res) => {
    res.send("simple CRUB is running")
})
app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
})