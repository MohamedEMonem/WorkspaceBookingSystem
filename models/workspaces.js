const mongoose = require("mongoose")
const workspacesSchema=mongoose.Schema({

  _id,
  name:{
    type:String,
    minlength: [3, 'Name of workspaces must be at least 3 characters'],
    required:true,
    trim:true,
  },
  "location": "Cairo",
  "rating": "4.5",
  "capacity": "50",
  "description": "A modern workspace in the heart of Cairo for startups and freelancers.",
  "solution": {
    "privateWorkspace": [
      "Dedicated Desk",
      "Private Office",
      "Full Floor Office"
    ],
    "additionalSolutions": [
      "Event Spaces"
    ]
  },
  "phone": "+20 100 123 4567",
  "workinghours": "9:00 AM - 9:00 PM",
  "workingdays": "Sunday - Thursday"

})

let mongooseModel= mongoose.model("Users",workspacesSchema)
module.exports=mongooseModel