Employee Management System (CRUD + Search)
This is a simple Employee Management System built using Node.js, Express.js, and MongoDB.
It allows you to add, update, delete, and search employees easily from a web interface.

📌 Features
Add Employee – Store employee name, position, and salary in the database.

1.View Employees – See all employees in a clean list format.
2.Update Employee – Edit details of any existing employee.
3.Delete Employee – Remove an employee from the database.
4.Search Employee – Search employees by name, position, or any keyword.

🛠️ Technologies Used
Backend: Node.js, Express.js
Database: MongoDB & Mongoose
Frontend: HTML, CSS, JavaScript (Fetch API)
Tools: Git, GitHub, VS Code

📂 Project Structure
employee-crud/
│── controllers/
│ └── employeeController.js
│── models/
│ └── employeeModel.js
│── routes/
│ └── employeeRoutes.js
│── public/
│ ├── index.html
│ ├── style.css
│ └── script.js
│── server.js
│── package.json
│── README.md

Installation & Setup

Clone the repository
git clone https://github.com/YOUR-USERNAME/employee-crud.git
cd employee-crud

Install dependencies
npm install

Start MongoDB

Make sure MongoDB is running locally or update the connection string in server.js.

Run the server
node server.js
Server will start at http://localhost:3000

Search Feature

You can search by entering any part of an employee’s name or position.

Search works in real-time and fetches matching employees from the database.

