export interface User {
  id: number;
  email: string;
  password: string;
  role?: "user" | "owner" | "manager";
}