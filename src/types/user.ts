export interface UserRegistrationData {
  email: string;
  password: string;
  full_name: string;
  interests: UserInterest[];
}

export type UserInterest = "consume" | "provide";
export type UserStatus = "active" | "suspended" | "deactivated";

export interface UserProfile {
  id?: string;
  email: string;
  full_name?: string | null;
  email_verified_at?: string | null;
  timezone?: string;
  locale?: string;
  roles?: string[];
  platform_roles?: string[];
  interests: UserInterest[];
  status?: UserStatus;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
