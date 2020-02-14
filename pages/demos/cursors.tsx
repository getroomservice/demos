import { useEffect, useState } from "react";
import client from "../../lib/client";

interface PresenceOptions {
  // "user" means the presence of a user, in any browser tab or device,
  // will be treated be updated simulataneously. If you have two tabs
  // open, but it's the same logged in user, you'll only show one mouse cursor.
  //
  // "connection" means every browser tab, device, or other "connection",
  // will have it's own presence. If you have two tabs open, but it's
  // the same logged in user, you'll show two mouse cursors.
  //
  // Default is by user.
  splitBy: "user" | "connection";
}

function usePresence<T>(
  room: string,
  key: string,
  options?: PresenceOptions
): [{ [key: string]: T }, (v: T) => void] {
  const [states, setStates] = useState({});
  const r = client.room(room);

  // @ts-ignore
  r._socketURL = "http://localhost:3001";

  const splitBy = options?.splitBy || "user";

  useEffect(() => {
    async function setup() {
      await r.init();

      r.onSetPresence((meta, value) => {
        const key =
          splitBy === "user" ? meta.guest!.reference : meta.connectionId;

        setStates(prevStates => {
          return { ...prevStates, [key]: value };
        });
      });
    }
    setup();
  }, [room, key]);

  function setPresence(value: any) {
    r.setPresence(key, value);
  }

  return [states, setPresence];
}

type Position = { x: number; y: number };

function useCursors(room: string) {
  const [cursors, setMyCursor] = usePresence<Position>(room, "cursors");

  useEffect(() => {
    const handleMouseMove = e => {
      setMyCursor({
        x: e.pageX,
        y: e.pageY
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [room]);

  return cursors;
}

function Cursor({ x, y, opacity }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate(${x}px, ${y}px)`,
        height: 24,
        width: 24,
        background: "#778beb",
        borderBottom: "4px solid #546de5",
        borderRadius: 30,
        transition: "transform 0.15s ease-out, opacity 0.15s",
        opacity: `${opacity}`
      }}
    />
  );
}
function Page() {
  const cursors = useCursors("cursor-room");
  return (
    <div>
      <pre>{JSON.stringify(cursors, null, 2)}</pre>
      {Object.entries(cursors).map(([key, value]) => {
        return <Cursor x={value.x} y={value.y} key={key} opacity={1} />;
      })}
    </div>
  );
}

export default Page;
