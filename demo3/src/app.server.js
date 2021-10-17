const express = require("express")
const app = express()

const env = require("dotenv")
env.config()


const mongoose = require("mongoose")
const User = require("./routes/user")

mongoose.connect(`mongodb://${process.env.LOCALHOST}:${process.env.PASSWORD}/${process.env.DATABASE}`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log("connection successfully");
}).catch((error) => {
    console.log(error);
})


app.use(express.json())
app.use(User)
app.listen(process.env.PORT, () =>{
    console.log(`connection at port no ${process.env.PORT}`);
})