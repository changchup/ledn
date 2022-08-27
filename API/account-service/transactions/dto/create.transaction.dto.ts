export interface CreateTransactionDto {
  id: string;
  userEmail: string;
  amount: string;
  type: string;
  createdAt: Date;
}