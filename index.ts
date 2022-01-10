import Express from 'express';
import { employeeDAOAzure } from './DAOs/employee-dao-azure';
import Employee from './Entities/employee';
import Reimburse from './Entities/reimburse';
import { ReimburseService } from './Services/reimburse-service';
import { ReimburseServiceImp } from './Services/reimburse-service-imp';

const app = Express();
app.use(Express.json());

const reimburseService: ReimburseService = new ReimburseServiceImp(
  employeeDAOAzure
);

//get all emp
app.get('/employees', async (req, res) => {
  const emps: Employee[] = await reimburseService.retrieveAllEmps();
  res.status(200).send(emps);
});

// get emp by id
app.get('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const emp: Employee = await reimburseService.retrieveEmpById(id);
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

app.listen(5000, () => console.log('App Started!'));
