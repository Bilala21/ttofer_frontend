export class Bid {
  id!: number;
  user_id!: string;
  product_id!: string;
  pric!: string;
  created_at!: string;
  updated_at!: string;
  user!: User; // Use the User model here
}
export class User {
  id!: number;
  name!: string;
}
