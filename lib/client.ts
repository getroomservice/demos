import RoomService from "@roomservice/browser";

const client = new RoomService({
  authUrl:
    process.env.NODE_ENV === "production"
      ? "https://demos.roomservice.dev/api/roomservice"
      : "http://localhost:3002/api/roomservice"
});

export default client;
