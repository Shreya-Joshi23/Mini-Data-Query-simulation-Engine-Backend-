/* 

create a strategic marketing approach for our groundbreaking Gen AI Analytics tool – a solution that democratizes data insights across business units.
Product Context
Our tool empowers non-technical teams to:

-Ask complex business questions directly
- Get instant, accurate insights from databases
- Eliminate dependency on data teams
- Make faster, data-driven decisions

Project: Mini Data Query Simulation Engine
Objective
Create a lightweight backend service that simulates a simplified version of our Gen AI Analytics data query system.
Technical Requirements

core functionalities:
Endpoint to simulate AI-powered data query processing
Mock database connection (can use in-memory storage)
Basic query translation mechanism

Specific Tasks

Create endpoints:

/query: Accepts natural language query
/explain: Returns simulated query breakdown
/validate: Checks query feasibility


Implement basic features:

Convert simple natural language queries to pseudo-SQL
Generate mock response for different query types
Include basic error handling
Implement lightweight authentication



Technical Stack

Language: Node.js 
Database: SQLite or in-memory solution
Recommended Frameworks:
Node.js: Express.js


*/

// What are the number of employees in your organisation

// system -> website -> what are the number of employees -> 12000

// //andr kaise processing ho rhi hogi

// question -> sql query -> database me vo query lgayega


import express from "express"
import appRouter from "./routes/route.js";
import cors from "cors"
import cookieParser from "cookie-parser";
const app=express();

app.use(express.json())

app.use(cors({
    allowedOrigins:['/vercel.app','http://localhost:5173'],
    credentials:true
}))

app.use(cookieParser())

app.use('/api/v1',appRouter)

const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Listening to port ${PORT}`)
})