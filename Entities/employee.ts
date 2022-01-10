import Reimburse from './reimburse';

export default interface Employee {
  id: string;
  fname: string;
  lname: string;
  username: string;
  password: string;
  reimburseAccount: Reimburse[];
  isManager: boolean;
  department: string;
}
