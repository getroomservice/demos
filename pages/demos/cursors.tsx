import { useEffect, useState } from "react";
import { usePresence, RoomServiceProvider } from "@roomservice/react";
import { useCookie } from "react-use";
import uuid from "uuid/v4";

type Position = { x: number; y: number };

function useMyCursorPosition() {
  const [state, setState] = useState();

  useEffect(() => {
    const handleMouseMove = e => {
      setState({
        x: e.pageX,
        y: e.pageY
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return state || { x: 0, y: 0 };
}

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

const colors = [
  ["#f3a683", "#f19066"],
  ["#f7d794", "#f5cd79"],
  ["#778beb", "#546de5"],
  ["#e77f67", "#e15f41"],
  ["#cf6a87", "#c44569"],
  ["#786fa6", "#574b90"],
  ["#f8a5c2", "#f78fb3"],
  ["#63cdda", "#3dc1d3"],
  ["#ea8685", "#e66767"]
];

function hashCode(str: string): number {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function Cursor({ x, y, opacity, shouldTransition }) {
  const [id] = useCookie("user");

  if (!id) {
    return null;
  }

  const [light, dark] = colors[Math.abs(hashCode(id)) % 7];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate(${x}px, ${y}px)`,
        height: 24,
        width: 24,
        background: light,
        borderBottom: `4px solid ${dark}`,
        borderRadius: 30,
        transition: shouldTransition
          ? "transform 0.15s ease-out, opacity 0.15s"
          : "",
        opacity: `${opacity}`
      }}
    >
      <div
        style={{
          position: "absolute",
          background: "#303952",
          height: 6,
          width: 6,
          borderRadius: 30,
          top: 10,
          transition: "transform 0.15s spring"
        }}
      />
      <div
        style={{
          position: "absolute",
          background: "#303952",
          height: 6,
          width: 6,
          borderRadius: 30,
          top: 10,
          left: 20,
          transition: "transform 0.15s spring"
        }}
      />
    </div>
  );
}

function Obj() {
  const cursors = useCursors("cursor-room");
  const myPos = useMyCursorPosition();
  return (
    <div>
      <div className="prompt">
        Hello! This is a demo of "presence", a new feature of Room Service. Here
        it's being used to add mouse cursors. <br />
        <br />
        <b>It requires a friend on a different computer to work best.</b> If
        you're truly alone, try just opening up two different browsers (safari +
        chrome for example). If you're on a mobile device, you'll be able to see
        other cursors, but not be able to move your own.
        <h2>What's Presence?</h2>
        Presence is a declarative API for describing what a user is doing in
        real time.
        <br />
        <br />
        Unlike Room Service's existing CRDT-based "documents", Presence does not
        do merging, nor does it keep a history of previous states. It only
        allows a user to edit their own state and say "here's what I'm doing
        right now."
        <p>
          That makes it perfect for stuff like:
          <ul>
            <li>Mouse cursors (like this demo)</li>
            <li>Cell-positions in a spread sheet</li>
            <li>Draggable UIs</li>
            <li>Sharing GPS locations</li>
            <li>Sharing tab a user's on</li>
            <li>Sharing the device the user's on</li>
            <li>???</li>
          </ul>
        </p>
        <p>
          Presence is a low-level react hook that you can use to build other
          stuff on top of. For example, for this demo, we've made a{" "}
          <code>useCursors</code> hook that uses Presence to store and update
          each person's position in real-time.
        </p>
        <p>
          <pre>
            {`
function useCursors(room: string) {
  const [cursors, setMyCursor] = usePresence(room, "cursors");

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

// We'll also be releasing this as an npm module!`.trim()}
          </pre>
        </p>
      </div>

      {Object.entries(cursors).map(([key, value]) => {
        return (
          <Cursor
            x={value.x}
            y={value.y}
            key={key}
            opacity={1}
            shouldTransition={true}
          />
        );
      })}

      <Cursor x={myPos.x} y={myPos.y} opacity={1} shouldTransition={false} />

      <style jsx>{`
        .prompt {
          width: 640px;
          margin: 0 auto;
          padding: 48px;
        }
      `}</style>
    </div>
  );
}

function Page() {
  const [id, setId] = useCookie("user");
  useEffect(() => {
    if (!id) {
      setId(uuid());
    }
  }, []);

  return (
    <RoomServiceProvider
      authUrl={
        process.env.NODE_ENV === "production"
          ? "https://demos.roomservice.dev/api/roomservice"
          : "http://localhost:3002/api/roomservice"
      }
      headers={{
        // @ts-ignore
        "x-rs-id": id
      }}
    >
      <Obj />
      <style jsx global>{`
        html {
          cursor: none;
        }
      `}</style>
    </RoomServiceProvider>
  );
}

export default Page;
