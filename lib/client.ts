import RoomService from "@roomservice/browser";

const client = new RoomService(
  process.env.NODE_ENV === "production"
    ? "https://demos.roomservice.dev/api/roomservice"
    : "http://localhost:3000/api/roomservice"
);

export default client;
