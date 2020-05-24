USE employee_db;
INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sale Lead", 85000, 1), 
       ("Salesperson", 65000, 1), 
       ("Lead Engineer", 95000, 2), 
       ("Sofeware Engineer", 82000,2),
       ("Accountant Manager", 90000, 3),
       ("Accountant", 75000, 3),
       ("Legal Team Lead", 86000, 4), 
       ("Lawyer", 78000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("John", "Snow", 1, null),
       ("Daenerys", "Targaryen", 3, null), 
	("Samwell", "Tarly", 2, 1),
       ("Arya", "Stark", 7, null), 
       ("Tyrion", "Lannister", 4, 2),
       ("Cersei", "Lannister", 8, 7),
       ("Podrick", "Payne", 5, null), 
       ("Margaery", "Tyrell", 6, 5);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;


DROP TABLE department;
DROP TABLE role;
DROP TABLE employee;