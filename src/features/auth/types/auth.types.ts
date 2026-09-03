export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePictureUrl?: string;
  gender?: string;
  role: string;
  status: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin: string;
  DOB?: string | null;
  province?: string | null;
  town?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  stayLoggedIn: boolean;
  submissionStarted: boolean;
  error: string | null;
}

export interface LoginRequest {
  identifier: string;
  password: string;
  stayLoggedIn?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  gender: string;
  deviceType: string;
  platform: string;
  DOB?: string;
  province?: string;
  town?: string;
}

export interface ForgotPasswordUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
}

export interface Province {
  id?: string;
  name: string;
}

export interface ProvincesResponse {
  data: Province[];
  message: string;
}

export interface Town {
  id?: string;
  name: string;
}

export interface TownsResponse {
  data: Town[];
  message?: string;
}
