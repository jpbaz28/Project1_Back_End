import EmployeeDAO from '../DAOs/employee-dao';
import Employee from '../Entities/employee';
import Reimburse from '../Entities/reimburse';
import { ReimburseService } from './reimburse-service';
import { v4 } from 'uuid';

export class ReimburseServiceImp implements ReimburseService {
  constructor(private employeeDAO: EmployeeDAO) {}

  async addReimburseToEmp(
    empId: string,
    reimburse: Reimburse
  ): Promise<Employee> {
    reimburse.id = v4();
    const emp: Employee = await this.employeeDAO.getEmpById(empId);
    emp.reimburseAccount.push(reimburse);
    await this.employeeDAO.updateEmp(emp);
    return emp;
  }
  async addEmp(emp: Employee): Promise<Employee> {
    emp.reimburseAccount = emp.reimburseAccount ?? [];
    emp = await this.employeeDAO.createEmp(emp);
    return emp;
  }
  async retrieveEmpById(empId: string): Promise<Employee> {
    return this.employeeDAO.getEmpById(empId);
  }

  retrieveEmpByUsername(username: string): Promise<Employee> {
    return this.employeeDAO.getEmpByUsername(username);
  }

  async retrieveAllEmps(): Promise<Employee[]> {
    return this.employeeDAO.getAllEmp();
  }
}
