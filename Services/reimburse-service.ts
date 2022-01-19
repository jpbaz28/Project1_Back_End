import Employee from '../Entities/employee';
import Reimburse from '../Entities/reimburse';

export interface ReimburseService {
  addReimburseToEmp(empId: string, reimburse: Reimburse): Promise<Employee>;

  getAllReimburses(): Promise<Reimburse[]>;

  getReimbursesForEmp(empId: string): Promise<Reimburse[]>;

  getReimburseById(reimburseId: string): Promise<Reimburse>;

  addEmp(emp: Employee): Promise<Employee>;

  retrieveEmpById(empId: string): Promise<Employee>;

  retrieveEmpByUsername(username: string): Promise<Employee>;

  retrieveAllEmps(): Promise<Employee[]>;

  modifyEmp(emp: Employee): Promise<Employee>;

  removeEmpById(empId: string): Promise<boolean>;
}
