export type Role = "user" | "owner" | "manager";

export interface User {
  id: number;
  email: string;
  role?: Role;
}
