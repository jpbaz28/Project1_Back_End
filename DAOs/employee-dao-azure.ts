import {
  CosmosClient,
  ItemResponse,
  Resource,
  ResourceResponse,
} from '@azure/cosmos';
import EmployeeDAO from './employee-dao';
import { v4 } from 'uuid';
import Employee from '../Entities/employee';

class EmployeeDAOAzure implements EmployeeDAO {
  private cosmosClient = new CosmosClient(process.env.PROJECT1_CONNECTION);
  private database = this.cosmosClient.database('Project1-db');
  private container = this.database.container('Employee');

  async createEmp(emp: Employee): Promise<Employee> {
    emp.id = v4();
    const response = await this.container.items.create<Employee>(emp);
    emp.reimburseAccount = emp.reimburseAccount ?? [];
    const {
      id,
      fname,
      lname,
      username,
      password,
      reimburseAccount,
      isManager,
    } = response.resource;
    return {
      id,
      fname,
      lname,
      username,
      password,
      reimburseAccount,
      isManager,
    };
  }
  async getEmpById(empId: string): Promise<Employee> {
    const emp: ItemResponse<Employee> = await this.container
      .item(empId, empId)
      .read<Employee>();
    const {
      id,
      fname,
      lname,
      username,
      password,
      reimburseAccount,
      isManager,
    } = emp.resource;
    return {
      id,
      fname,
      lname,
      username,
      password,
      reimburseAccount,
      isManager,
    };
  }

  async getEmpByUsername(uname: string): Promise<Employee> {
    const emps = await this.getAllEmp();
    return emps.find((e) => e.username === uname);
  }
  async getAllEmp(): Promise<Employee[]> {
    const emps = await this.container.items.readAll<Employee>().fetchAll();
    return emps.resources.map((e) => ({
      id: e.id,
      fname: e.fname,
      lname: e.lname,
      username: e.username,
      password: e.password,
      reimburseAccount: e.reimburseAccount,
      isManager: e.isManager,
    }));
  }
  async updateEmp(emp: Employee): Promise<Employee> {
    const updatedEmp = await this.container.items.upsert<Employee>(emp);
    return updatedEmp.resource;
  }
  async deleteEmp(empId: string): Promise<boolean> {
    const response = await this.container.item(empId, empId).delete();
    return true;
  }
}
export const employeeDAOAzure = new EmployeeDAOAzure();
