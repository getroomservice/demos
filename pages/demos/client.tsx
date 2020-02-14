import { useEffect, useState } from "react";
import uuid from "uuid/v4";
import client from "../../lib/client";

const room = client.room("second example");
// @ts-ignore
room._socketURL = "http://localhost:3001";

export default () => {
  const [state, setState] = useState<any>({});

  useEffect(() => {
    async function load() {
      setState(await room.restore());
      const { doc } = await room.init();
      setState(doc);
      room.onSetDoc(state => setState(state));
    }
    load();
  }, []);

  async function onAdd(title) {
    const state = await room.setDoc(prevState => {
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
