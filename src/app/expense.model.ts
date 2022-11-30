export class Expense {
  constructor(
    public id: string,
    public date: Date,
    public amount: number,
    public description: string,
    public currency: string,
    public receiptCaptured: boolean,
    public receiptPhotoBase64: string,
    public receiptTimeStamp: Date,
    public claimed: boolean,
    public paid: boolean){}
};
