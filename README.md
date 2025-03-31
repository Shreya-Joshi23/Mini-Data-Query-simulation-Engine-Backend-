# Mini Data Query Simulation Engine

## Overview
The **Mini Data Query Simulation Engine** is a lightweight backend service designed to simulate a **Gen AI Analytics Data Query System**. It enables users to interact with a **Neon.tech database** using **natural language queries**, which are converted into **SQL statements** via an AI model and executed securely.

## Features
- ✅ **AI-Powered SQL Generation** – Converts natural language queries into **SQL statements**.
- ✅ **Query Execution** – Runs the generated SQL queries on a Neon.tech database.
- ✅ **Query Validation** – Ensures SQL query correctness before execution.
- ✅ **Secure Authentication** – Uses **cookie-based authentication**.
- ✅ **Email Verification** – Users must verify their email before querying.
- ✅ **JWT Token-Based Authorization** – Ensures protected API access.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon.tech)
- **Authentication:** JWT, OTP-based email verification
- **AI Model:** Google Gemini API
- **Deployment:** Render

## Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Shreya-Joshi23/Mini-Data-Query-simulation-Engine-Backend-.git
cd Mini-Data-Query-simulation-Engine-Backend-
```

### 2️⃣ Create a `.env` File
Add the following environment variables:
```ini
PORT=3000
DATABASE_URL="postgresql://neondb_owner:your_password@your_neon_db_url/neondb?sslmode=require"
JWT_SECRET="your_secret_key"
HOST_MAIL="your-email@gmail.com"
HOST_PASS="your-app-password"
HOST_SERVICE="gmail"
GOOGLE_API_KEY="your-google-api-key"
```

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Run the Server
```bash
npm run dev
```

## API Endpoints

### 🔹 Authentication
- **Signup** → `POST /signup`
- **Login** → `POST /signin`
- **Generate OTP** → `POST /generateotp`
- **Verify OTP** → `POST /verifyotp`

### 🔹 Query Operations
- **Ask a Question** → `GET /query`  
  _Gives response of natural language_ 
- **/explain: Returns simulated query breakdown** -> `GET /explain`
- _Gives sql query to the question_
- **Validate SQL Query** → `GET /validate`  
  _Checks if the generated SQL query is valid_

## Live Demo & API Documentation
- **Backend Live URL:** [Mini Data Query Simulation Engine](https://mini-data-query-simulation-engine-rmhu.onrender.com)
- **API Documentation:** [Postman Collection](https://documenter.getpostman.com/view/29375720/2sB2cRBPT7)

## Contributing
Feel free to contribute! Fork the repo, create a new branch, and submit a pull request. 🚀

## License
This project is **MIT licensed**.

---
🚀 **Mini Data Query Simulation Engine** – Making data querying effortless with AI!
