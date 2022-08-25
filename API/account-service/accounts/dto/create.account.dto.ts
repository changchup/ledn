export interface CreateAccountDto {
  userEmail: string;
  status?: Status;
  createdAt: Date;
  updatedAt?: Date;
}