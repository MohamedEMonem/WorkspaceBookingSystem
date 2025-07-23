const mongoose = require("mongoose")
const workspacesSchema=mongoose.Schema({

  _id,
  name:{
    type:String,
    minlength: [3, 'Name of workspaces must be at least 3 characters'],
    required:true,
    trim:true,
  },
  location: String,//"Cairo"
  rating:String ,//"4.5",
  capacity:Number,// "50",
  description:String,// "A modern workspace in the heart of Cairo for startups and freelancers.",
  solution: {
  enum:["privateWorkspace","additionalSolutions"],//"privateWorkspace": [
   privateWorkspace:[] ,
   additionalSolutions:[]                        //  "Dedicated Desk",                                             //]
  },
  phone: {
    type: String,
    minlength: [3, 'Name of users must be at least 3 characters'],
    required: true,
    trim: true,
  },
  workinghours:{
    type: String,
    minlength: [3, 'Name of users must be at least 3 characters'],
    required: true,
    trim: true,
  },// ,"9:00 AM - 9:00 PM",
  workingdays:{
    type: String,
    minlength: [3, 'Name of users must be at least 3 characters'],
    required: true,
    trim: true,
  },// ,"Sunday - Thursday"
})

let mongooseModel= mongoose.model("Users",workspacesSchema)
module.exports=mongooseModel