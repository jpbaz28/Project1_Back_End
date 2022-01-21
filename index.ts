import Express from 'express';
import { employeeDAOAzure } from './DAOs/employee-dao-azure';
import Employee from './Entities/employee';
import Reimburse from './Entities/reimburse';
import { LoginService, LoginServiceImp } from './Services/login-service';
import { ReimburseService } from './Services/reimburse-service';
import { ReimburseServiceImp } from './Services/reimburse-service-imp';
import cors from 'cors';

const app = Express();
app.use(Express.json());
app.use(cors());

const reimburseService: ReimburseService = new ReimburseServiceImp(
  employeeDAOAzure
);

const loginService: LoginService = new LoginServiceImp(employeeDAOAzure);

//get all emp
app.get('/employees', async (req, res) => {
  const emps: Employee[] = await reimburseService.retrieveAllEmps();
  res.status(200).send(emps);
});

// get emp by id
// app.get('/employees/:id', async (req, res) => {
//   const { id } = req.params;
//   const emp: Employee = await reimburseService.retrieveEmpById(id);
//   res.send(emp);
// });

//get emp by username
app.get('/employees/:username', async (req, res) => {
  const { username } = req.params;
  const emp: Employee = await reimburseService.retrieveEmpByUsername(username);
  res.send(emp);
});

//get all reimbursements
app.get('/reimbursements', async (req, res) => {
  const reimburses: Reimburse[] = await reimburseService.getAllReimburses();
  res.status(200).send(reimburses);
});

//get all reimbursements for emp by name
app.get('/reimbursements/:username', async (req, res) => {
  const reimburses: Reimburse[] = await reimburseService.getReimbursesForEmp(
    req.params.username
  );
  res.status(200).send(reimburses);
});

app.get('/reimbursements/:username/:reimId', async (req, res) => {
  const reimburse: Reimburse = await reimburseService.getSingleReimForEmp(
    req.params.username,
    req.params.reimId
  );
  res.status(200).send(reimburse);
});

//add emp
app.post('/employees', async (req, res) => {
  let emp: Employee = req.body;
  emp = await reimburseService.addEmp(emp);
  res.status(201).send(emp);
});

//add reimbursement
app.post('/employees/:id/reimbursements', async (req, res) => {
  const reimburse: Reimburse = req.body;
  await reimburseService.addReimburseToEmp(req.params.id, reimburse);
  res.send(reimburse);
});

//update emp
app.put('/employees/:id', async (req, res) => {
  const updatedEmp: Employee = req.body;
  const newEmp: Employee = await reimburseService.modifyEmp(updatedEmp);
  res.status(200).send(newEmp);
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
  } catch (error) {
    res.send('Unable to login. Check that username and password are correct.');
  }
});

//approve reimbursement for emp
app.patch('/reimbursements/approve/:username/:reimId', async (req, res) => {
  const emp = await reimburseService.approveReimForEmp(
    req.params.username,
    req.params.reimId
  );
  res.status(200).send(emp);
});

//deny reimbursement for emp
app.patch('/reimbursements/deny/:username/:reimId', async (req, res) => {
  const emp = await reimburseService.denyReimForEmp(
    req.params.username,
    req.params.reimId
  );
  res.status(200).send(emp);
});

//delete emp
app.delete('/employees/:id', async (req, res) => {
  const status: boolean = await reimburseService.removeEmpById(req.params.id);
  if (status) {
    res.status(202).send(`Deleted employee with id ${req.params.id}`);
  } else {
    res
      .status(404)
      .send(`Employee with id ${req.params.id} could not be located.`);
  }
});

app.listen(5000, () => console.log('App Started!'));
