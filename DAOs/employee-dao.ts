import Employee from '../Entities/employee';

export default interface EmployeeDAO {
  createEmp(emp: Employee): Promise<Employee>;

  getEmpById(empId: string): Promise<Employee>;

  getEmpByUsername(username: string): Promise<Employee>;

  getAllEmp(): Promise<Employee[]>;

  updateEmp(emp: Employee): Promise<Employee>;

  deleteEmp(empId: string): Promise<boolean>;
}
