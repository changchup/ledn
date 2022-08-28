export interface CreateTransactionDto {
  id: string;
  userEmail: string;
  amount: number;
  type: string;
  createdAt: Date;
}