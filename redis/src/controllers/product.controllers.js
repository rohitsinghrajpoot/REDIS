const express = require("express")

const Product = require("../models/product.model")
const client = require("../configs/redis")

const router= express.Router()


router.get("",async (req,res)=>{
    try{
       
        client.get("products", async function(err, fetchedProducts){
         if(fetchedProducts){
             const products = JSON.parse(fetchedProducts)

             return res.status(200).send({products,redis:true})
         }else{
            try{
                 const products = await Product.find().lean().exec()

                 client.set("products", JSON.stringify(products))

                 return res.status(200).send({products,redis:false})
            }catch(err){
                   return res.status(500).send({message:err.message})
            }
         }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

router.post("",async (req,res)=>{
    try{
        const product = await Product.create(req.body)
         
        const products = await Product.find().lean().exec()

        client.set("products",JSON.stringify(products))

        return res.status(201).send(product)
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

router.get("/:id",async (req,res)=>{
   try{
    
    client.get(`products.${req.params.id}`,async function(err,fetchedProduct){
        if(fetchedProduct){
            const product = JSON.parse(fetchedProduct)

            res.status(200).send({product,redis:true})
        }else{
            try{
                const product = await Product.findById(req.params.id).lean().exec()

                client.set(`products.${req.params.id}`,JSON.stringify(product))

                res.status(200).send({product,redis:false})
            }catch(err){
            res.status(500).send({message:err.message})
            }
        }
    })
   }catch(err){
       res.status(500).send({msg:err.msg})
   }
})

router.patch("/:id",async (req,res)=>{
    try{
      const product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec()
 
     const products = await Product.find().lean().exec()

     client.set(`products.${req.params.id}`,JSON.stringify(product))
     client.set("products",JSON.stringify(products))

     res.status(500).send(product)
    }catch(err){
        res.status(500).send({msg:err.msg})
    }
 })

 router.delete("/:id",async (req,res)=>{
    try{
      const product = await Product.findByIdAndDelete(req.params.id)

      const  products = await Product.find().lean().exec()

      client.del(`products.${req.params.id}`)
      client.set("products",JSON.stringify(products))
 
      res.status(200).send(product)
    }catch(err){
        res.status(500).send({msg:err.msg})
    }
 })


module.exports= router