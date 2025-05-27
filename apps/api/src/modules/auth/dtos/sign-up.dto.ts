export interface SignUpDto {
  email: string;
  password: string;
  metadata?: Record<string, unknown>;
}
