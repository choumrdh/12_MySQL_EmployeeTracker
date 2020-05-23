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
            choices: ["View Departments", "View Roles", "View All Employee", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Update Employee Manager", "View Employees by Manager", "Delete Department", "Delete Role", "Delete Employee", "Exit"]
        }
    ])
};
async function startPromptAnswer(connection) {
    const answer = await startPrompt();
    switch (answer.action) {
        case "View Departments":
            await viewDepartment(connection);
            await startPromptAnswer(connection);
            break;
        case "View Roles":
            await viewRole(connection);
            await startPromptAnswer(connection);
            break;
        case "View All Employee":
            await viewAllEmployee(connection);
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
            const returnEmployee = await addEmployeePrompt(connection);
            await addEmployee(connection, returnEmployee);
            await startPromptAnswer(connection);
            break;
        case "Update Employee Role":
            const returnUpdateEmployeeRole = await updateEmployeeRolePrompt(connection);
            await updateEmployeeRole(connection, returnUpdateEmployeeRole);
            await startPromptAnswer(connection);
            break;
        case "Update Employee Manager":
            const returnUpdateEmployeeManager = await updateEmployeeManagerPrompt(connection);
            await updateEmployeeManager(connection, returnUpdateEmployeeManager);
            await viewAllEmploye(connection);
            await startPromptAnswer(connection);
            break;
        case "View Employees by Manager":

            await startPromptAnswer(connection);
            break;
        case "Delete Department":
            const getDeleteDepartment = await deleteDepartmentPrompt(connection);
            await deleteDepartment(connection, getDeleteDepartment);
            await viewDepartment(connection);
            await startPromptAnswer(connection);
            break;
        case "Delete Role":
            const getDeleteRole = await deleteRolePrompt(connection);
            await deleteRole(connection, getDeleteRole);
            await viewRole(connection);
            await startPromptAnswer(connection);
            break;
        case "Delete Employee":
            const getDeleteEmployee = await deleteEmployeePrompt(connection);
            await deleteEmployee(connection, getDeleteEmployee);
            await viewAllEmploye(connection);
            await startPromptAnswer(connection);
            break;
        case "Exit":
            connection.end();
            break;
    }

};
// VIEW
const viewAllEmployee = async (connection) => {
    const sqlQuery =`SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, role.salary, department.name AS department, CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`;
    const [rows, fields] = await connection.query(sqlQuery);
    console.table(rows);
}

const viewDepartment = async (connection) => {
    const [rows, fields] = await connection.query("SELECT * FROM department");
    console.table(rows)
    return rows;
};
const viewRole = async (connection) => {
    const [rows, fields] = await connection.query("SELECT role.id, role.title, role.salary, department.name FROM role INNER JOIN department on department_id = department.id");
    console.table(rows)
    return rows;
};
const viewEmployee = async (connection) => {
    const [rows, fields] = await connection.query("SELECT * FROM employee");
    console.table(rows)
    return rows;
};
async function viewManagerName(connection) {
    const [rows, fields] = await connection.query("SELECT * FROM employee WHERE manager_id IS NULL");
    console.table(rows);
    return rows;
};
// ADD

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
    console.table(`----------Added Department----------`, rows);
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
    try {
        const sqlQuery = "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)"
        const params = [returnRole.roleTitle, parseFloat(returnRole.salaryWage).toFixed(2), parseInt(returnRole.departmentId)];
        const [rows, fields] = await connection.query(sqlQuery, params);
        console.table(`----------Added Role----------`, rows)
    } catch (err) {
        console.log(`err at addRole function`, err)
    }
};
async function addEmployeePrompt(connection) {
    const viewRoleList = await viewRole(connection);
    let roleList = viewRoleList.map((role) => {
        return `${role.id},${role.title}`;
    });
    const viewManagerList = await viewManagerName(connection);
    let managerList = viewManagerList.map((manager) => {
        return `${manager.id},${manager.first_name}, ${manager.role_id}`
    })
    return inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Whay is employee's first name?",
            validate: (name) => {
                var checkUpperCase = /^[A-Z]/;
                if (checkUpperCase.test(name)) {
                    console.log(`. ${name}`)
                    return true
                } else if (name === "") {
                    console.log("Please Enter first name");
                    return false
                } else {
                    console.log(". Please enter name with capitalized first letter.");
                    return false
                }
            }
        }, {
            type: "input",
            name: "lastName",
            message: "What is employee's last name?",
            validate: (name) => {
                var checkUpperCase = /^[A-Z]/;
                if (checkUpperCase.test(name)) {
                    console.log(`. ${name}`)
                    return true
                } else if (name === "") {
                    console.log("Please Enter last name");
                    return false
                } else {
                    console.log(". Please enter name with capitalized first letter.");
                    return false
                }
            }
        }, {
            type: "list",
            name: "employeeRoleId",
            message: "What is employee's role?",
            choices: roleList
        }
        , {
            type: "list",
            name: "managerId",
            message: "Who is employee's manager?",
            choices: managerList
        }
    ]);
}
const addEmployee = async (connection, returnEmployee) => {
    try {
        const sqlQuery = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
        const params = [returnEmployee.firstName, returnEmployee.lastName, returnEmployee.employeeRoleId.split(",")[0], returnEmployee.managerId.split(",")[0]]
        const [rows, fields] = await connection.query(sqlQuery, params);
        console.table(`----------Added Employee ${returnEmployee.firstName} ${returnEmployee.lastName}----------`, rows);
    } catch (err) {
        console.log(`err at addEmployee function`, err)
    }
};

// UPDATE
async function updateEmployeeRolePrompt(connection) {
    const viewEmployeeList = await viewEmployee(connection);
    let employeeList = viewEmployeeList.map((employee) => {
        return `${employee.id},${employee.first_name},${employee.last_name}`
    });
    const viewRoleList = await viewRole(connection);
    let roleList = viewRoleList.map((role) => {
        return `${role.id},${role.title}`;
    });
    return inquirer.prompt([
        {
            type: "list",
            name: "updateEmployee",
            message: "Please choose employee to update role",
            choices: employeeList
        }, {
            type: "list",
            name: "updateRoleList",
            message: "Please select employee's role.",
            choices: roleList
        }
    ]);
}
const updateEmployeeRole = async (connection, returnUpdateEmployeeRole) => {
    const sqlQuery = "UPDATE employee SET role_id = ? WHERE id = ?"
    console.log(returnUpdateEmployeeRole);
    const params = [parseInt(returnUpdateEmployeeRole.updateRoleList.split(",")[0]), parseInt(returnUpdateEmployeeRole.updateEmployee.split(",")[0])]
    const [rows] = await connection.query(sqlQuery, params);
    console.log(`----------Updated Employee Role----------`)
};
const updateEmployeeManagerPrompt = async (connection) => {
    const viewEmployeeList = await viewEmployee(connection);
    let employeeList = viewEmployeeList.map((employee) => {
        return `${employee.id},${employee.first_name},${employee.last_name}`
    });
    const viewManagerList = await viewManagerName(connection);
    let managerList = viewManagerList.map((manager) => {
        return `${manager.id},${manager.first_name}, ${manager.role_id}`
    })
    return inquirer.prompt([
        {
            type: "list",
            name: "updateEmpMgr",
            message: "Please choose employee to update manager",
            choices: employeeList
        }, {
            type: "list",
            name: "updateManagerList",
            message: "Please select employee's manager.",
            choices: managerList
        }
    ]);
}
const updateEmployeeManager = async (connection, returnUpdateEmployeeManager) => {
    const sqlQuery = "UPDATE employee SET id ? WHERE manager_id = ?"
    console.log(returnUpdateEmployeeManager);
    const params = [parseInt(returnUpdateEmployeeManager.updateEmpMgr.split(",")[0]), parseInt(returnUpdateEmployeeManager.updateManagerList.split(",")[0])]
    const [rows] = await connection.query(sqlQuery, params);
    console.log(`----------Updated Employee Manager----------`)
}

// DELETE
const deleteDepartmentPrompt = async (connection) => {
    const viewDepartmentList = await viewDepartment(connection);
    let departmentListId = viewDepartmentList.map((department) => {
        console.log(`ID: ${department.id}, NAME:${department.name}`)
        return `${department.id},${department.name}`;
    })
    return inquirer.prompt([
        {
            type: "list",
            name: "deleteDepartmentName",
            message: "Which department whould you like to delete?",
            choices: departmentListId
        }
    ])
};
const deleteDepartment = async (connection, getDeleteDepartment) => {
    const sqlQuery = "DELETE FROM department WHERE id = ?";
    const params = [getDeleteDepartment.deleteDepartmentName.split(",")[0]];
    const [rows] = await connection.query(sqlQuery, params);

    console.table(`----------Removed Department----------`);
};
const deleteRolePrompt = async (connection) => {
    const viewRoleList = await viewRole(connection);
    let roleList = viewRoleList.map((role) => {
        console.log("RoleID: " + role.id, "RoleTitle: " + role.title)
        return `${role.id},${role.title}`;
    });
    return inquirer.prompt([
        {
            type: "list",
            name: "deleteRoleName",
            message: "Which role would you like to delete?",
            choices: roleList
        }
    ]);
};
const deleteRole = async (connection, getDeleteRole) => {
    const sqlQuery = "DELETE FROM role WHERE id = ?";
    const params = [getDeleteRole.deleteRoleName.split(",")[0]];
    const [rows] = await connection.query(sqlQuery, params);
    console.table(`----------Removed Role----------`);
};
const deleteEmployeePrompt = async (connection) => {
    const viewEmployeeList = await viewEmployee(connection);
    let employeeList = viewEmployeeList.map((employee) => {
        console.log(`${employee.id},${employee.first_name},${employee.last_name}`)
        return `${employee.id},${employee.first_name} ${employee.last_name}`
    });
    return inquirer.prompt([
        {
            type: "list",
            name: "deleteEmployeeName",
            message: "Which emplolyee would you like to delete?",
            choices: employeeList
        }
    ]);
};
const deleteEmployee = async (connection, getDeleteEmployee) => {
    try {
        const sqlQuery = "DELETE FROM employee WHERE id = ?";
        const params = [getDeleteEmployee.deleteEmployeeName.split(",")[0]];
        const [rows] = await connection.query(sqlQuery, params);
        console.table(`----------Removed Employee----------`);
    } catch (error) {
        console.log(`Error at deleteEmployee`, error)
    }

};



main();