const app = require("./index")
const connect = require("./configs/db")

app.listen(3300, async (req,res)=>{
    try{
       await connect()
       console.log("listening port 3300")
    }catch(err){
      console.error({message:err.message})
    }
})