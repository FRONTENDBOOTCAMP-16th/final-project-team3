export interface Dojang {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  phone?: string;
  style_tags?: string[];
  created_at: string;
}
