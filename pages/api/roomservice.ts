import RoomService from "@roomservice/node";
import { NextApiRequest, NextApiResponse } from "next";

const PROD_KEY = "sk_test_RfQ1lXiPakf4Sjqt34_70";

const client = new RoomService(PROD_KEY);

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { room } = client.parse(req.body);

  return client.authorize(res, {
    guest: "someone",
    room: room.reference
  });
};
