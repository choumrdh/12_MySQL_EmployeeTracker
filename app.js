const mysql = require("mysql2/promise");
const cTable = require("console.table");
const inqurier = require("inqurier");

const main = async () => {
    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "password",
            database: "employee_db"
        });
        console.log(`Connected to db with id ${connection.threadId}`)
        await viewDepartment(connection);
        await viewRole(connection);
        await viewEmployee(connection);
        

        connection.end();
    } catch (err) {
        console.log(`There is an error in main ` + err)
    };
};
const viewDepartment = async (connection) => {
    const [rows, fields] = await connection.query("SELECT * FROM department");
    console.table(rows)
};
const viewRole = async (connection) => {
    const [rows, fields] = await connection.query("SELECT * FROM role");
    console.table(rows)
};

const viewEmployee = async (connection) => {
    const [rows, fields] = await connection.query("SELECT * FROM employee");
    console.table(rows)
};
async function addDepartmentPrompt() {
    return inqurier.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "Input new department name"
        }
    ])
};
const AddDepartment = async (connection) => {
    const sqlQuery = "INSERT INTO department ?";
    const params = [name]
    const [rows, fields] = await connection.query(sqlQuery, params);
    console.table(rows);
};
async function addRolePrompt(){
    return inqurier.prompt([
        {
            
        }
    ])
};
main();