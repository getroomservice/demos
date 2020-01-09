import RoomService from "@roomservice/node";
import { NextApiRequest, NextApiResponse } from "next";

const PROD_KEY = "sk_test_RfQ1lXiPakf4Sjqt34_70";
const LOCAL_KEY = "sk_test_8d18VP_DR74KidQZT4Syk";
const client = new RoomService(PROD_KEY);

// @ts-ignore
// client._apiUrl = "http://localhost:3001";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { room } = client.parse(req.body);

  return client.authorize(res, {
    guest: "someone",
    room: room.reference
  });
};
