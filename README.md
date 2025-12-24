# Expense Sharing Backend API

A robust RESTful API for managing group expenses, handling complex split logic (Equal, Exact, Percentage), and simplifying debt graphs. Built with **Node.js**, **Express**, and **MySQL**.

## 🚀 Key Features

* **Graph Simplification Algorithm:** Implements a greedy algorithm to minimize the total number of transactions required to settle debts within a group.
* **ACID Transactions:** Uses MySQL transactions to ensure data integrity. If any part of an expense split fails, the entire operation is rolled back to prevent data corruption.
* **Integer Precision:** All monetary values are stored in cents/paise to avoid floating-point rounding errors (e.g., `0.1 + 0.2 != 0.3`).
* **Settlement System:** Allows users to record payments and "settle up" debts effectively.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL (Relational Data & Transactions)
* **Dev Tools:** Nodemon, Postman

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
Open your terminal and run this command to download the code:
```bash
git clone https://github.com/harsh09tiwari/CredResolve_Assignment.git
cd CredResolve_Assignment
```

### 2\. Install Dependencies

```bash
npm install express mysql2 dotenv
```

### 3. Database Configuration
* Create a MySQL database named expense_tracker in your local machine.

* Import the schema table structure:

* Run the SQL commands found in schema.sql.

* (Optional) Import dummy data:

Run the SQL commands found in seeds.sql.

### 4\. Setup Environment Variables

Create a new file named `.env` in the root folder (the main folder). Open it and paste the following configuration:
```env
DB_HOST=localhost
DB_USER=YourUsername
DB_PASSWORD=YourPassword
DB_NAME=YourDatabaseName
PORT=3000
```
Replace `YourUsername`, `YourPassword`, and `YourDatabaseName` with your actual MySQL credentials and database name.

### 5\. Start the Server

Run development server cmd on your local machine:
```bash
npm run dev
```
If successful, you will see a message in the terminal:
> `Server is running on port: 3000`
> `MongoDB Connected`
---

## 🔌 API Endpoints

### 👥 Users

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/users/create` |  Create a new user |
| `GET` | `/api/users/getAll` | List all users |



### 📂 Groups


| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/groups` | List all groups |
| `POST` | `/api/groups/create` | Create a group with members |
| `GET` | `/api/groups/id/:id/members` | Get members of a specific group |
| `GET` | `/api/groups/id/:id/balance` | Get simplified debt graph |

### 💸 Expenses

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/expenses/addExpense` | Add expense (Supports EQUAL, EXACT, PERCENTAGE) |
| `POST` | `/api/expenses/settleExpense` | Settle dues between


## 📡 Testing
A Postman Collection is included in this repository for easy testing.

* Open Postman.

* Import endpoints.postman_collection.json.

Test endpoints directly.

### 🧠 Engineering Decisions

#### Why MySQL over MongoDB?
 Financial data requires strict consistency. I chose a relational database to utilize Transactions. If a user is charged but the split record fails, the database must roll back to prevent "ghost money."

#### Why Integer Math? 
 To ensure 100% precision, all currency is handled as integers (cents/paise) in the backend and only formatted to decimals for the final display.