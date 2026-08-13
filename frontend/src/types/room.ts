export interface RoomFeature {
  icon: string;
  label: string;
}

export interface BookingPrice {
  roomId: number;
  price: string;
}

export interface Room {
  id: number;
  name: string;
  capacity: number;
  imageUrl: string;
  imageUrlDisplay?: string;
  bookingPrice?: BookingPrice | null;
  createdBy?: { name: string };
  updatedBy?: { name: string };
}
