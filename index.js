const inquirer = require('inquirer');
const connection = require('./db');

function promptUser() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View Departments',
          'View Roles',
          'View Employees',
          'Add Department',
          'Add Role',
          'Add Employee',
          'Update Employee Role',
          'Exit',
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case 'View Departments':
          viewDepartments();
          break;
        case 'View Roles':
          viewRoles();
          break;
        case 'View Employees':
          viewEmployees();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          break;
        default:
          console.log('Invalid action.');
          promptUser();
      }
    });
}

// Function to view departments
function viewDepartments() {
  const query = 'SELECT * FROM departments';
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    promptUser();
  });
}

// Function to view roles
function viewRoles() {
  const query = `
    SELECT roles.id, roles.title, departments.name AS department, roles.salary
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.id
  `;
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    promptUser();
  });
}

// Function to view employees
function viewEmployees() {
  const query = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employees e
    INNER JOIN roles r ON e.role_id = r.id
    INNER JOIN departments d ON r.department_id = d.id
    LEFT JOIN employees m ON e.manager_id = m.id
  `;
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    promptUser();
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the new department:',
      },
    ])
    .then((answer) => {
      const query = 'INSERT INTO departments (name) VALUES (?)';
      connection.query(query, [answer.name], (err, result) => {
        if (err) throw err;
        console.log('Department added successfully.');
        promptUser();
      });
    });
}

// Function to add a role
function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the new role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the new role:',
      },
      {
        type: 'input',
        name: 'department_id',
        message: 'Enter the corresponding department ID for the new role:',
      },
    ])
    .then((answer) => {
      const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
      connection.query(query, [answer.title, answer.salary, answer.department_id], (err, result) => {
        if (err) throw err;
        console.log('Role added successfully.');
        promptUser();
      });
    });
}

// Function to add an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the new employee:',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the new employee:',
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'Enter the role ID for the new employee:',
      },
      {
        type: 'input',
        name: 'manager_id',
        message: 'Enter the manager ID for the new employee (leave blank if none):',
      },
    ])
    .then((answer) => {
      const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
      const managerId = answer.manager_id ? answer.manager_id : null;
      connection.query(query, [answer.first_name, answer.last_name, answer.role_id, managerId], (err, result) => {
        if (err) throw err;
        console.log('Employee added successfully.');
        promptUser();
      });
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'employee_id',
        message: 'Enter the ID of the employee you want to update:',
      },
      {
        type: 'input',
        name: 'new_role_id',
        message: 'Enter the new role ID for the employee:',
      },
    ])
    .then((answer) => {
      const query = 'UPDATE employees SET role_id = ? WHERE id = ?';
      connection.query(query, [answer.new_role_id, answer.employee_id], (err, result) => {
        if (err) throw err;
        console.log('Employee role updated successfully.');
        promptUser();
      });
    });
}

// Start the application
promptUser();
