// function1->question to sql query using gen ai giving it a prompt
// function2 -> executes sql query in db
// function3 -> checks for validity

import { GoogleGenAI } from "@google/genai";
import { querySchema } from "../../validations/queryschema.js";
import db from "../../db/db.js";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const systemPrompt = `
You are an expert at converting natural language to SQL queries. 
The database has a table called USER with the following columns: NAME, EMAIL, PASSWORD.

Rules:
1. Only return the SQL query (no extra text, no explanations,no '\n',';' at end).
2. The SQL query should NOT have 'sql' or triple backticks .
3. Keep queries simple and avoid complex joins.
4. If question is invalid i.e cannot be converted into a sql query output "UNKNOWN QUESTION" 

Examples:
- "How many records are present?" ➝ SELECT COUNT(*) FROM USER
- "List all users?" ➝ SELECT * FROM USER
;`;

const generatesql = async (query) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: `${systemPrompt}\nUser Question:"${query}"\nSQL Query:` },
        ],
      },
    ],
  });
  return response.text;
};

export async function quesTosql(req, res) {
  try {
    const parsedData = querySchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    const response = await generatesql(parsedData.data.question);
    console.log(response)
    const generatedQuery = response;

    if (!generatedQuery) {
      throw new Error("Failed to generate SQL query");
    }

    console.log("Generated SQL Query:", generatedQuery);

    res.status(200).json({
      message: "Query computed successfully",
      query: generatedQuery,
    });
  } catch (error) {
    console.error("Error generating query:", error);
    res.status(400).json({ error: error.message });
  }
}

//function to execute query and return result
export async function executequery(req, res) {

  const { query } = req.body;

  try {
    if (!query.trim().toUpperCase().startsWith("SELECT")) {
      return res.status(400).json({ error: "Only SELECT queries are allowed" });
    }

    const result = await db.$queryRawUnsafe(query);

    const processedResult = JSON.parse(
      JSON.stringify(result, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({
      message: "Query executed successfully",
      result: processedResult,
    });
  } catch (error) {
    console.error("Query Execution Error:", error.message);
    res.status(400).json({ error: "Failed to execute query" });
  }
}

export async function checkisvalid(req, res) {
  const question = req.body.question;
  try {
    const sqlQuery = await generatesql(question);
    console.log(sqlQuery)
    const isValid = sqlQuery && sqlQuery.toUpperCase().startsWith("SELECT");
    res.status(200).json({question, sqlQuery, isValid });
  } catch (error) {
    console.error("Query Validation Error:", error.message);
    res.status(400).json({ error: "Failed to check validity" });
  }
}
