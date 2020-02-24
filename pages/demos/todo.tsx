import { RoomServiceProvider, useSharedState } from "@roomservice/react";
import { useEffect } from "react";

function App() {
  const [state, setState] = useSharedState<any>("my-room-ya-know");

  return <div>{state.value || "undefined"}</div>;
}

function Page() {
  return (
    <RoomServiceProvider
      authUrl={
        process.env.NODE_ENV === "production"
          ? "https://demos.roomservice.dev/api/roomservice"
          : "http://localhost:3003/api/roomservice"
      }
    >
      <App />
      <style jsx global>{`
        html {
          cursor: none;
        }
      `}</style>
    </RoomServiceProvider>
  );
}

export default Page;
