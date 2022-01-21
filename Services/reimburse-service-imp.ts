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
    reimburse.username = emp.username;
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

  async getReimbursesForEmp(username: string): Promise<Reimburse[]> {
    const emp: Employee = await this.employeeDAO.getEmpByUsername(username);
    return emp.reimburseAccount;
  }

  async getSingleReimForEmp(
    username: string,
    reimId: string
  ): Promise<Reimburse> {
    const emp: Employee = await this.employeeDAO.getEmpByUsername(username);
    return emp.reimburseAccount.find(({ id }) => id === reimId);
  }

  async approveReimForEmp(username: string, reimId: string): Promise<Employee> {
    const emp: Employee = await this.employeeDAO.getEmpByUsername(username);
    //get the single reimburse obj to update
    const updatedReimburse: Reimburse = emp.reimburseAccount.find(
      (i) => i.id === reimId
    );
    //find index to splice off of emp reim accounts
    const index: number = emp.reimburseAccount.findIndex(
      (i) => i.id === reimId
    );
    // remove the old account
    emp.reimburseAccount.splice(index, 1);
    //update new account to add
    updatedReimburse.isApproved = true;
    updatedReimburse.isPending = false;
    // add updated account to emp account array
    emp.reimburseAccount.push(updatedReimburse);

    await this.employeeDAO.updateEmp(emp);

    return emp;
  }

  async denyReimForEmp(username: string, reimId: string): Promise<Employee> {
    const emp: Employee = await this.employeeDAO.getEmpByUsername(username);
    //get the single reimburse obj to update
    const updatedReimburse: Reimburse = emp.reimburseAccount.find(
      (i) => i.id === reimId
    );
    //find index to splice off of emp reim accounts
    const index: number = emp.reimburseAccount.findIndex(
      (i) => i.id === reimId
    );
    // remove the old account
    emp.reimburseAccount.splice(index, 1);
    //update new account to add
    updatedReimburse.isApproved = false;
    updatedReimburse.isPending = false;
    // add updated account to emp account array
    emp.reimburseAccount.push(updatedReimburse);

    await this.employeeDAO.updateEmp(emp);

    return emp;
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
