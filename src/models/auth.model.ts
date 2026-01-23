// src/models/auth.model.ts - FULL CODE
export class Auth {
  username: string = "";
  password: string = "";
}

// ✅ NEW: User interface for response
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  photoUrl?: string | null;
}

// ✅ UPDATED: AuthResponse with user data
export class AuthResponse {
  access_token: string = "";
  user?: User; // ✅ NEW: User data from backend
}
