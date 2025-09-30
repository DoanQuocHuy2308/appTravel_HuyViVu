export type UserRole = 'customer' | 'admin' | 'staff' | 'guide';
export type UserStatus = 'active' | 'inactive';
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
}


