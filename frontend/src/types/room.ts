export interface RoomFeature {
  icon: string;
  label: string;
}

export interface BookingPrice {
  roomId: number;
  price: number;
}

export interface Room {
  id: number;
  name: string;
  capacity: number;
  imageUrl: string;
  bookingPrice?: BookingPrice | null;
}
