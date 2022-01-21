import EmployeeDAO from '../DAOs/employee-dao';
import Employee from '../Entities/employee';
import Reimburse from '../Entities/reimburse';
import { LoginService, LoginServiceImp } from '../Services/login-service';

describe('Login Service Tests', () => {
  const employeeDAOStub: EmployeeDAO = {
    async createEmp(emp: Employee): Promise<Employee> {
      return {
        id: '',
        fname: 'Test',
        lname: 'Favre',
        username: 'theguy',
        password: 'd0g',
        isManager: false,
        reimburseAccount: [],
      };
    },
    getEmpById: function (empId: string): Promise<Employee> {
      throw new Error('Function not implemented.');
    },
    getEmpByUsername: function (username: string): Promise<Employee> {
      const emp = this.createEmp();
      return emp;
    },
    getAllEmp: function (): Promise<Employee[]> {
      throw new Error('Function not implemented.');
    },
    updateEmp: function (emp: Employee): Promise<Employee> {
      throw new Error('Function not implemented.');
    },
    deleteEmp: function (empId: string): Promise<boolean> {
      throw new Error('Function not implemented.');
    },
  };

  const loginService: LoginService = new LoginServiceImp(employeeDAOStub);

  it('Should throw an error if username and password does not match', async () => {
    try {
      await loginService.loginWithUserAndPass('Wrong', 'Name');
      fail();
    } catch (error) {
      expect(error.message).toBe('Password does not match');
    }
  });
});
