export class User {
  _id: string = '';
  full_name: string = '';
  email: string = '';
  username: string = '';
  hashed_password: string = '';
  type: string = '';
  is_disabled: boolean = false;
  photo_url: string = '';
  google_account_id: string = '';
  session_id: string | null = null;
  created_at: Date = new Date();
  updated_at: Date = new Date();
}
