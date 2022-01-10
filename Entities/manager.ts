import Employee from './employee';

export default interface Manager {
  id: string;
  fname: string;
  lname: string;
  employees: Employee[];
}
