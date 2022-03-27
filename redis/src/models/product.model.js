const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    whenToComplete:{type:Date,required:true},
    isCompleted:{type:String,required:false,default:false}
},{
    versionKey:false,
    timestamps:true
}
)

module.exports = mongoose.model("product",productSchema)