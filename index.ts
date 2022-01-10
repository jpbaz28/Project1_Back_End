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

app.get('/employees/:username', async (req, res) => {
  const { username } = req.params;
  const emp: Employee = await reimburseService.retrieveEmpByUsername(username);
  res.send(emp);
});

//add emp
app.post('/employees', async (req, res) => {
  let emp: Employee = req.body;
  emp = await reimburseService.addEmp(emp);
  res.status(201).send(emp);
});

app.post('/employees/:id/reimbursements', async (req, res) => {
  const reimburse: Reimburse = req.body;
  await reimburseService.addReimburseToEmp(req.params.id, reimburse);
  res.send(reimburse);
});

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

app.listen(5000, () => console.log('App Started!'));
