import Employee from '../Entities/employee';
import Reimburse from '../Entities/reimburse';

export interface ReimburseDAO {
  addReimburseToEmp(empId: string, reimburse: Reimburse): Promise<Employee>;

  getAllReimburses(): Promise<Reimburse[]>;

  getAllReimbursesForEmp(empId: string): Promise<Reimburse[]>;

  getReimburseById(reimId: string): Promise<Reimburse>;

  updateReimburseById(reimId: string): Promise<Reimburse>;

  deleteReimburseById(reimId: string): Promise<boolean>;
}
