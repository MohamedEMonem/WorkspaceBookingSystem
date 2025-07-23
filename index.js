//express
const express = require('express');
const app = express();
app.use(express.json())
//mongoose
const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://mohamedemoniem:UoIKjgHG4DECbuPO@workspacedb.moqih61.mongodb.net/workspaceDB").then(()=>{
console.log("Connection to DB is Successfully");
}).catch(()=>{
console.log("Connection to DB is Failed");
})
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});