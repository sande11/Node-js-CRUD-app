const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/product.model');
const app = express()

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false})); //to allow entering data in non-json form e.g form data

// routes
app.use("/api/products", productRoute);

app.get('/', (req, res)=>{
    res.send('Hello World');
})

// add products to database
app.post('/api/products', async (req, res)=>{
  try{
    const product = await Product.create(req.body);
    res.status(200).json(product);
  }catch(error){
    res.status(500).json(error.message);
  }
});

// update a product
app.put('/api/products/:id', async (req,res)=>{
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        
        if(!product){
            return req.status(404).json({message: "Product not found"});
        }

        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);

    }catch(error){
        res.status(500).json({message: error.mesage});
    }
})

// delete a product
app.delete('/api/products/:id', async (req, res)=>{
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);

        if(!product) {
            return res.status(404).json({message: "Product not found"});
        }
        res.status(200).json({message: "Product deleted successfully"});
    }catch(error){
        res.status(500).json({message: error.mesage});
    }
})

// get products from database
app.get('/api/products', async (req,res) =>{
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }catch(error){
        res.status(500).json({message: error.mesage})
    }
})

//get particular product using an ID
app.get('/api/products/:id', async (req,res) =>{
    try{
        const {id} = req.params;
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    }catch(error){
        res.status(500).json({message: error.mesage})
    }
});


// connect to db
mongoose.connect("mongodb+srv://kelvinsande:accesslist@backeenddb.lm9e3b6.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackeendDB")
.then(()=>{
    console.log("Connected to database");
    app.listen(3000, ()=>{
        console.log('Server is running on port 3000')
    })
})
.catch(()=>{
    console.log("Error connecting to database");
})
