import EmployeeDAO from '../DAOs/employee-dao';
import Employee from '../Entities/employee';
import { employeeDAOAzure } from '../DAOs/employee-dao-azure';
import Reimburse from '../Entities/reimburse';

const employeeDAO: EmployeeDAO = employeeDAOAzure;

let testId: string = null;

describe('Employee DAO Tests', () => {
  it('Should create an employee', async () => {
    let emp: Employee = {
      id: '',
      fname: 'Testy',
      lname: 'Daniels',
      username: 'coolguy',
      password: '123p',
      isManager: false,
      reimburseAccount: [],
    };
    emp = await employeeDAO.createEmp(emp);
    expect(emp.id).not.toBe('');
    testId = emp.id;
  });

  it('Should get an employee by ID', async () => {
    const emp: Employee = await employeeDAO.getEmpById(testId);
    expect(emp.fname).toBe('Testy');
  });

  it('Should get all employees', async () => {
    const emps: Employee[] = await employeeDAO.getAllEmp();
    expect(emps.length).toBeGreaterThanOrEqual(1);
  });

  it('Should update an employee', async () => {
    const reimburse: Reimburse = {
      username: 'theguy',
      id: '101',
      amount: 500,
      date: '1642738123',
      comment: 'Drinks',
      isApproved: false,
      isPending: true,
    };
    let emp: Employee = {
      id: testId,
      fname: 'Test',
      lname: 'Favre',
      username: 'theguy',
      password: 'd0g',
      isManager: false,
      reimburseAccount: [reimburse],
    };

    emp = await employeeDAO.updateEmp(emp);
    expect(emp.reimburseAccount.length).toBe(1);
    expect(emp.fname).toBe('Test');
  });

  it('Should delete an employee', async () => {
    const deleteFlag: boolean = await employeeDAO.deleteEmp(testId);
    expect(deleteFlag).toBeTruthy();
  });
});
