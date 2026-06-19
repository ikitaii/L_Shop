export {}; 

declare global {
  namespace Express {
    interface Request {
      userId: number;
      locale?: "ru" | "be";
      userRole?: "user" | "owner" | "manager";
    }
  }
}