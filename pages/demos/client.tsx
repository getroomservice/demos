import { useEffect, useState } from "react";
import uuid from "uuid/v4";
import client from "../../lib/client";

const room = client.room("client-room-4");
// @ts-ignore
// room._socketURL = "http://localhost:3001";

export default () => {
  const [state, setState] = useState<any>({});

  useEffect(() => {
    async function load() {
      setState(await room.restore());
      const { state } = await room.connect();
      setState(state);
      room.onUpdate(state => setState(state));
    }
    load();
  }, []);

  function onAdd(title) {
    const state = room.publishState(prevState => {
      if (!prevState.todos) {
        prevState.todos = [];
      }

      const id = uuid();
      prevState.todos.push({
        id,
        title,
        checked: false
      });
    });
    setState(state);

    setTimeout(() => {
      // @ts-ignore
      console.log(room._automergeConn);
    }, 100);
  }

  const todos = Object.values(state.todos || []).map((todo: any) => (
    <div key={todo.id}>
      <strong>{todo.title}</strong>
    </div>
  ));

  const [txt, setTxt] = useState("");

  return (
    <div>
      <h1>Todos</h1>
      {todos}

      <input
        type="text"
        onChange={e => {
          setTxt(e.target.value);
        }}
      />
      <button onClick={() => onAdd(txt)}>Add todo</button>
    </div>
  );
};
