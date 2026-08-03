export interface RoomFeature {
  icon: string;
  label: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: string;
  description: string;
  pricePerSession: number;
  imageUrl: string;
  isAvailable: boolean;
}
