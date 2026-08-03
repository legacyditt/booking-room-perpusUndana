export interface RoomFeature {
  icon: string;
  label: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: string;
  features: RoomFeature[];
  description: string;
  pricePerSession: number;
  imageUrl: string;
  isAvailable: boolean;
}
