import Employee from '../Entities/employee';
import Reimburse from '../Entities/reimburse';

export interface ReimburseService {
  addReimburseToEmp(empId: string, reimburse: Reimburse): Promise<Employee>;

  addEmp(emp: Employee): Promise<Employee>;

  retrieveEmpById(empId: string): Promise<Employee>;

  retrieveAllEmps(): Promise<Employee[]>;
}
