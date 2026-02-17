export type Role = 'dealer' | 'fund_manager' | 'cio' | 'risk' | 'super_admin';

export interface UserToken {
  userId: string;
  role: Role;
}
