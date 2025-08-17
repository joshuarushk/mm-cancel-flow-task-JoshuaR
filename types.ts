export type DownsellVariant = 'A' | 'B';

export interface Subscription {
  id: string;
  user_id: string;
  monthly_price: number; // cents
  status: 'active' | 'canceled';
  pending_cancellation: boolean;
  created_at: string;
}

export interface Cancellation {
  id: string;
  user_id: string;
  downsell_variant: DownsellVariant;
  reason: string | null;
  accepted_downsell: boolean | null;
  created_at: string;
  status: 'pending' | 'confirmed';
}
