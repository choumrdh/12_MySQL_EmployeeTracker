const mysql = require("mysql2/promise");
const cTable = require("console.table");
const inquirer = require("inquirer");

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
        const returnDepartment = await addDepartmentPrompt(connection);
        await AddDepartment(connection, returnDepartment);
        await addRolePrompt(connection)

        connection.end();
    } catch (err) {
        console.log(`There is an error in main ` + err)
    };
};
const viewDepartment = async (connection) => {
    const [rows, fields] = await connection.query("SELECT * FROM department");
    console.table(rows)
    return rows
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
    return inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "Input new department name"
        }
    ])
};
const AddDepartment = async (connection, returnDepartment) => {
    const sqlQuery = "INSERT INTO department (name) VALUES (?)";
    const params = [returnDepartment.departmentName]
    const [rows, fields] = await connection.query(sqlQuery, params);
    console.table(`Add Department`,rows);
};
async function addRolePrompt(connection){
    const viewDepartmentList = await viewDepartment(connection);
    let departmentList = viewDepartmentList.map((department)=>{
        return department.name
    })
    
    return inquirer.prompt([
        {
            type:"input",
            name:"roleTitle",
            message:"Please enter new role title",
        },{
            type: "number",
            name:"salary",
            message:"Please enter new role salary",
        },{
            type:"list",
            name:"departmentList",
            message:"Please choose department for this role",
            choices:departmentList
        }
    ])
};
const addRole = ()=>{ 
    
};
main();