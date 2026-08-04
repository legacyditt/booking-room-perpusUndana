import { Room } from "@/types/room";

export const mockRooms: Room[] = [
  {
    id: "1",
    name: "Ruang Archibald",
    capacity: "1-2",
    description: "Ruangan yang tenang dan intim, sempurna untuk penelitian mandiri atau sesi bimbingan pribadi.",
    pricePerSession: 0,
    imageUrl: "/rooms/archibald.jpg",
    isAvailable: true,
    type: "reguler",
  },
  {
    id: "2",
    name: "Ruang Kolaborasi B",
    capacity: "4-6",
    description: "Dilengkapi dengan layar presentasi, ideal untuk proyek kelompok dan persiapan seminar.",
    pricePerSession: 0,
    imageUrl: "/rooms/hub-b.jpg",
    isAvailable: true,
    type: "reguler",
  },
  {
    id: "3",
    name: "Ruang Kolaborasi C",
    capacity: "4-6",
    description: "Dilengkapi dengan layar presentasi, ideal untuk proyek kelompok dan persiapan seminar.",
    pricePerSession: 25.00,
    imageUrl: "/rooms/hub-c.jpg",
    isAvailable: true,
    type: "premium",
  },
  {
    id: "4",
    name: "Ruang Seminar Alpha",
    capacity: "10-15",
    description: "Ruangan luas yang dirancang untuk diskusi kelompok besar, kuliah, atau lokakarya akademik.",
    pricePerSession: 40.00,
    imageUrl: "/rooms/seminar-alpha.jpg",
    isAvailable: false,
    type: "premium",
  }
];
