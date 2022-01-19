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

  async getAllReimburses(): Promise<Reimburse[]> {
    const emps: Employee[] = await this.employeeDAO.getAllEmp();
    // creates an array of object arrays [[{}],[{}],[{}]]
    const reimburses = emps.map((e) => e.reimburseAccount);
    //merges the objects into one array
    const mergedReimburses = [].concat.apply([], reimburses);
    return mergedReimburses;
  }

  async getReimbursesForEmp(empId: string): Promise<Reimburse[]> {
    const emp: Employee = await this.employeeDAO.getEmpById(empId);
    return emp.reimburseAccount;
  }
  getReimburseById(reimburseId: string): Promise<Reimburse> {
    throw new Error('Method not implemented.');
  }

  async addEmp(emp: Employee): Promise<Employee> {
    emp.reimburseAccount = emp.reimburseAccount ?? [];
    emp = await this.employeeDAO.createEmp(emp);
    return emp;
  }
  retrieveEmpById(empId: string): Promise<Employee> {
    return this.employeeDAO.getEmpById(empId);
  }

  retrieveEmpByUsername(username: string): Promise<Employee> {
    return this.employeeDAO.getEmpByUsername(username);
  }

  retrieveAllEmps(): Promise<Employee[]> {
    return this.employeeDAO.getAllEmp();
  }

  modifyEmp(emp: Employee): Promise<Employee> {
    return this.employeeDAO.updateEmp(emp);
  }

  removeEmpById(empId: string): Promise<boolean> {
    return this.employeeDAO.deleteEmp(empId);
  }
}
