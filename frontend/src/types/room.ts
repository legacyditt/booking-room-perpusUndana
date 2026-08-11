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
  bookingPrice?: BookingPrice | null;
}

// Ruangan premium = punya harga booking; reguler = gratis.
export const isPremiumRoom = (room: Pick<Room, "bookingPrice">) =>
  room.bookingPrice != null;
