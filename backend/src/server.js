import express from "express"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import connectDB from "./lib/db.js";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
   
const app = express();
const PORT = process.env.PORT 

app.use(express.json())

app.use("/api/auth",authRoutes)

app.listen(PORT,async ()=>{
    console.log("Sever is running on: "+PORT);
    await connectDB();
})