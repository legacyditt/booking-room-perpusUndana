import { Room } from "@/types/room";

export const mockRooms: Room[] = [
  {
    id: "1",
    name: "The Archibald Suite",
    capacity: "1-2 People",
    features: [
      { icon: "wifi", label: "Fast WiFi" }
    ],
    description: "A quiet, intimate space perfect for solitary research or one-on-one tutoring sessions.",
    pricePerSession: 15.00,
    imageUrl: "/rooms/archibald.jpg",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Collaborative Hub B",
    capacity: "4-6 People",
    features: [
      { icon: "monitor", label: "Display Screen" }
    ],
    description: "Equipped with a presentation screen, ideal for group projects and seminar preparation.",
    pricePerSession: 25.00,
    imageUrl: "/rooms/hub-b.jpg",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Collaborative Hub C",
    capacity: "4-6 People",
    features: [
      { icon: "monitor", label: "Display Screen" }
    ],
    description: "Equipped with a presentation screen, ideal for group projects and seminar preparation.",
    pricePerSession: 25.00,
    imageUrl: "/rooms/hub-c.jpg",
    isAvailable: true,
  },
  {
    id: "4",
    name: "Seminar Room Alpha",
    capacity: "10-15 People",
    features: [
      { icon: "projector", label: "Projector" },
      { icon: "whiteboard", label: "Whiteboard" }
    ],
    description: "A spacious room designed for large group discussions, lectures, or academic workshops.",
    pricePerSession: 40.00,
    imageUrl: "/rooms/seminar-alpha.jpg",
    isAvailable: false,
  }
];
