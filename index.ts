import Express from 'express';
import { employeeDAOAzure } from './DAOs/employee-dao-azure';
import Employee from './Entities/employee';
import Reimburse from './Entities/reimburse';
import { LoginService, LoginServiceImp } from './Services/login-service';
import { ReimburseService } from './Services/reimburse-service';
import { ReimburseServiceImp } from './Services/reimburse-service-imp';
import cors from 'cors';
import errorHandler from './Errors/error-handle';

const app = Express();
app.use(Express.json());
app.use(cors());

const logger = require('./utils/logger');
const port = process.env.PORT ?? 5000;
const host = 'localhost';

const reimburseService: ReimburseService = new ReimburseServiceImp(
  employeeDAOAzure
);

const loginService: LoginService = new LoginServiceImp(employeeDAOAzure);

//get all emp
app.get('/employees', async (req, res) => {
  try {
    const emps: Employee[] = await reimburseService.retrieveAllEmps();
    res.status(200).send(emps);
    logger.info('Server sent all employees');
  } catch (error) {
    errorHandler(error, res);
    logger.info('Error with GET /employees');
  }
});

// // get emp by id
// app.get('/employees/:id', async (req, res) => {
//   const { id } = req.params;
//   const emp: Employee = await reimburseService.retrieveEmpById(id);
//   res.send(emp);
// });

// get emp by username
app.get('/employees/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const emp: Employee = await reimburseService.retrieveEmpByUsername(
      username
    );
    res.status(200).send(emp);
    logger.info(`Server sent employee with username: ${username}`);
  } catch (error) {
    errorHandler(error, res);
    logger.info(
      `Error with GET /employees/${req.params.username}. Username not found`
    );
  }
});

//get all reimbursements
app.get('/reimbursements', async (req, res) => {
  try {
    const reimburses: Reimburse[] = await reimburseService.getAllReimburses();
    res.status(200).send(reimburses);
    logger.info('Server sent all reimbursements for all employees');
  } catch (error) {
    errorHandler(error, res);
    logger.info('Error with GET /reimbursements. Reimbursements not sent!');
  }
});

//get all reimbursements for emp by name
app.get('/reimbursements/:username', async (req, res) => {
  try {
    const reimburses: Reimburse[] = await reimburseService.getReimbursesForEmp(
      req.params.username
    );
    res.status(200).send(reimburses);
    logger.info(
      `Server sent all reimbursements for username: ${req.params.username}`
    );
  } catch (error) {
    errorHandler(error, res);
    logger.info(`Error sending reimbursements for ${req.params.username}`);
  }
});

//get single reimbursement for employee by username and reimID
app.get('/reimbursements/:username/:reimId', async (req, res) => {
  try {
    const reimburse: Reimburse = await reimburseService.getSingleReimForEmp(
      req.params.username,
      req.params.reimId
    );
    res.status(200).send(reimburse);
    logger.info(
      `Server sent reimbursement with ID: ${req.params.reimId} for username: ${req.params.username}`
    );
  } catch (error) {
    errorHandler(error, res);
    logger.info(
      `Error. Reimbursement with ID: ${req.params.reimId} and username: ${req.params.username} not found.`
    );
  }
});

//add emp
app.post('/employees', async (req, res) => {
  try {
    let emp: Employee = req.body;
    emp = await reimburseService.addEmp(emp);
    res.status(201).send(emp);
    logger.info(`Server added employee with ID: ${emp.id}`);
  } catch (error) {
    errorHandler(error, res);
    logger.info('Error adding employee!');
  }
});

//add reimbursement
app.post('/employees/:id/reimbursements', async (req, res) => {
  try {
    const reimburse: Reimburse = req.body;
    await reimburseService.addReimburseToEmp(req.params.id, reimburse);
    res.send(reimburse);
    logger.info(`Added reimbursement to employee with ID: ${req.params.id}`);
  } catch (error) {
    errorHandler(error, res);
    logger.info(
      `Error adding reimbursement to employee with ID: ${req.params.id}`
    );
  }
});

//update emp
app.put('/employees/:id', async (req, res) => {
  try {
    const updatedEmp: Employee = req.body;
    const newEmp: Employee = await reimburseService.modifyEmp(updatedEmp);
    res.status(200).send(newEmp);
    logger.info(`Updated employee with ID: ${req.params.id}`);
  } catch (error) {
    errorHandler(error, res);
    logger.info(`Error updating employee with ID: ${req.params.id}`);
  }
});

//login route
app.patch('/login', async (req, res) => {
  try {
    const body: { username: string; password: string } = req.body;
    const emp: Employee = await loginService.loginWithUserAndPass(
      body.username,
      body.password
    );
    res.send(emp);
    logger.info(`Successful login for ${body.username}.`);
  } catch (error) {
    res.send('Unable to login. Check that username and password are correct.');
    logger.info(`Error logging in!`);
  }
});

//approve reimbursement for emp
app.patch('/reimbursements/approve/:username/:reimId', async (req, res) => {
  try {
    const reimburses: Reimburse[] = await reimburseService.approveReimForEmp(
      req.params.username,
      req.params.reimId
    );
    res.status(200).send(reimburses);
    logger.info(
      `Approved reimbursement for ${req.params.username} with ID: ${req.params.reimId}`
    );
  } catch (error) {
    errorHandler(error, res);
    logger.info(
      `Error approving reimbursement for ${req.params.username} with ID: ${req.params.reimId}`
    );
  }
});

//deny reimbursement for emp
app.patch('/reimbursements/deny/:username/:reimId', async (req, res) => {
  try {
    const reimburses: Reimburse[] = await reimburseService.denyReimForEmp(
      req.params.username,
      req.params.reimId
    );
    res.status(200).send(reimburses);
    logger.info(
      `Denied reimbursement for ${req.params.username} with ID: ${req.params.reimId}`
    );
  } catch (error) {
    errorHandler(error, res);
    logger.info(
      `Error denying reimbursement for ${req.params.username} with ID: ${req.params.reimId}`
    );
  }
});

//delete emp
app.delete('/employees/:id', async (req, res) => {
  const status: boolean = await reimburseService.removeEmpById(req.params.id);
  if (status) {
    res.status(202).send(`Deleted employee with id ${req.params.id}`);
    logger.info(`Deleted employee with ID: ${req.params.id}`);
  } else {
    res
      .status(404)
      .send(`Employee with id ${req.params.id} could not be located.`);
    logger.info(`Error deleting employee with ID; ${req.params.id}`);
  }
});

//Delete all reimburses for emp
app.delete('/reimbursements/:username', async (req, res) => {
  try {
    const reimburses: Reimburse[] = await reimburseService.deleteAllReimForEmp(
      req.params.username
    );
    res.send(reimburses);
    logger.info(
      `Deleted all reimbursements for employee with Username: ${req.params.username}`
    );
  } catch (error) {
    errorHandler(error, res);
    logger.info(
      `Error deleting reimbursements for employee with Username: ${req.params.username}`
    );
  }
});

// Logging Starts Here
// Captures 404 erors for logging
app.use((req, res, next) => {
  res.status(404).send('RESOURCE NOT FOUND');
  logger.error(
    `400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );
});

// Captures 500 errors for logging
app.use((err, req, res, next) => {
  res.status(500).send('Internal Server error!');
  logger.error(
    `${err.status || 500} - ${res.statusMessage} - ${err.message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  );
});

app.listen(process.env.PORT ?? 5000, () => console.log('App Started!'));
