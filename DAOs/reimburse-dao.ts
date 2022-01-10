import Reimburse from '../Entities/reimburse';

export interface ReimburseDAO {
  createReimburse(reimburse: Reimburse): Promise<Reimburse>;

  getAllReimburses(): Promise<Reimburse[]>;

  getAllReimbursesForEmp(empId: string): Promise<Reimburse[]>;

  getReimburseById(reimId: string): Promise<Reimburse>;

  updateReimburseById(reimId: string): Promise<Reimburse>;

  deleteReimburseById(reimId: string): Promise<boolean>;
}
