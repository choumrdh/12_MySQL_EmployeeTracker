const mysql = require("mysql2/promise");
const Table = require("console.table");
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
        startPromptAnswer(connection);

    } catch (err) {
        console.log(`There is an error in main ` + err)
    };
};
function startPrompt() {
    return inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would like to do?",
            choices: ["View Departments", "View Roles", "View Employee", "Add Department", "Add Role", "Add Employee", "Update Employee", "Update Employee Managers", "View Employees by Manager", "Delete Department", "Delete Role", "Delete Employee", "Exit"]
        }
    ])
};
async function startPromptAnswer(connection) {
    const answer = await startPrompt();
    switch (answer.action) {
        case "View Departments":
            console.log("-----Departments-----");
            await viewDepartment(connection);
            await startPromptAnswer(connection);
            break;
        case "View Roles":
            console.log("-----Roles-----");
            await viewRole(connection);
            await startPromptAnswer(connection);
            break;
        case "View Employee":
            console.log("-----Employee-----");
            await viewEmployee(connection);
            await startPromptAnswer(connection);
            break;
        case "Add Department":
            const returnDepartment = await addDepartmentPrompt(connection);
            await addDepartment(connection, returnDepartment);
            await startPromptAnswer(connection);
            break;
        case "Add Role":
            const returnRole = await addRolePrompt(connection);
            await addRole(connection, returnRole);
            await startPromptAnswer(connection);
            break;
        case "Add Employee":

            await startPromptAnswer(connection);
            break;
        case "Update Employee":

            await startPromptAnswer(connection);
            break;
        case "Update Employee Managers":

            await startPromptAnswer(connection);
            break;
        case "View Employees by Manager":

            await startPromptAnswer(connection);
            break;
        case "Delete Department":

            await startPromptAnswer(connection);
            break;
        case "Delete Role":

            await startPromptAnswer(connection);
            break;
        case "Delete Employee":

            await startPromptAnswer(connection);
            break;
        case "Exit":
            connection.end();
            break;
    }

}

const viewDepartment = async (connection) => {
    const [rows, fields] = await connection.query("SELECT * FROM department");
    console.table(rows)
    return rows;
};
const viewRole = async (connection) => {
    const [rows, fields] = await connection.query("SELECT * FROM role");
    console.table(rows)
    return rows;
};

const viewEmployee = async (connection) => {
    const [rows, fields] = await connection.query("SELECT * FROM employee");
    console.table(rows)
    return rows;
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
const addDepartment = async (connection, returnDepartment) => {
    const sqlQuery = "INSERT INTO department (name) VALUES (?)";
    const params = [returnDepartment.departmentName]
    const [rows, fields] = await connection.query(sqlQuery, params);
    console.table(`Added Department`, rows);
};
async function addRolePrompt(connection) {
    const viewDepartmentList = await viewDepartment(connection);
    let departmentListId = viewDepartmentList.map((department) => {
        return `${department.id}, ${department.name}`;
    })
    return inquirer.prompt([
        {
            type: "input",
            name: "roleTitle",
            message: "Please enter new role's title",
        }, {
            type: "input",
            name: "salaryWage",
            message: "Please enter new role's salary"
        }, {
            type: "list",
            name: "departmentId",
            message: "Please choose department for this role",
            choices: departmentListId
        }
    ])
};
const addRole = async (connection, returnRole) => {
    try{
        const sqlQuery = "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)"
        const params = [returnRole.roleTitle, parseFloat(returnRole.salaryWage).toFixed(2), parseInt(returnRole.departmentId)];
        const [rows, fields] = await connection.query(sqlQuery, params);
        console.table(`Added Role`, rows)
    } catch (err){
        console.log(`err at addRole function`,err)
    }
    
};

main();