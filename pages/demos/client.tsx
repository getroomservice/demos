import client from "../../lib/client";
import { useEffect, useState } from "react";

const room = client.room("cross-over-room");

export default () => {
  const [doc, setDoc] = useState();

  useEffect(() => {
    async function load() {
      const { doc } = await room.init();

      setDoc(doc);

      room.onSetDoc(d => {
        setDoc(d);
      });
    }
    load();
  }, []);
  return (
    <div>
      room state:
      <pre>{JSON.stringify(doc, null, 2)}</pre>
    </div>
  );
};
