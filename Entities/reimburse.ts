export default interface Reimburse {
  id: string;
  amount: number;
  date: string;
  comment: string;
  //upload: File;
  isApproved: boolean;
  isPending: boolean;
}
