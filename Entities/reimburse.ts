export default interface Reimburse {
  username: string;
  id: string;
  amount: number;
  date: string;
  comment: string;
  //upload: File;
  isApproved: boolean;
  isPending: boolean;
}
