import EmployeeDAO from '../DAOs/employee-dao';
import Employee from '../Entities/employee';

export interface LoginService {
  loginWithUserAndPass(username: string, password: string): Promise<Employee>;
}

export class LoginServiceImp implements LoginService {
  private employeeDAO: EmployeeDAO;

  constructor(employeeDAO: EmployeeDAO) {
    this.employeeDAO = employeeDAO;
  }

  async loginWithUserAndPass(
    username: string,
    password: string
  ): Promise<Employee> {
    const emp: Employee = await this.employeeDAO.getEmpByUsername(username);
    if (emp.password != password) {
      throw new Error('Password does not match');
    } else {
      return emp;
    }
  }
}
