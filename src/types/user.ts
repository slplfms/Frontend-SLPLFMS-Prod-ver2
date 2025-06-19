export interface User {
  name?: string;
  employeeId: string | null;
  vehicle:any | null;
  permissions?: [];

  [key: string]: unknown;
}
