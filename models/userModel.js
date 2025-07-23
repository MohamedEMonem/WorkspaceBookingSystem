const mongoose = require("mongoose")
const usersSchema=mongoose.Schema({
    _id,
  name:{
    type: String,
    minlength: [3, 'Title must be at least 3 characters'],
    required:true,
    trim:true,
  },
  history: [],
  authorization: {
    isSuperuser: {type:Boolean,default:False},
    role: {
        enum:["admin","owner","normal_user"],
        default:"normal_user"
    }
  },
  email:String,
  phone: String,
  gender: String,
  birthday: String

})

let mongooseModel= mongoose.model("Users",usersSchema)

module.exports=mongooseModel