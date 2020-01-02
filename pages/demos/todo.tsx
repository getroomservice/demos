import { useRoomService } from "@roomservice/react";
import { useState } from "react";
import uuid from "uuid/v4";
import client from "../../lib/client";
import { Centered, FadeIn } from "../../lib/ui";

const Todo = ({ todo, onCheck, onRemove }) => {
  function onClick() {
    if (todo.checked) {
      onRemove(todo.id);
    } else {
      onCheck(todo.id);
    }
  }

  return (
    <FadeIn>
      <div className={`todo ${todo.checked && "checked"}`}>
        <strong>{todo.title}</strong>
        <button onClick={onClick}>{todo.checked ? "Remove" : "Finish"}</button>
        <style jsx>{`
          .todo {
            padding: 12px 0px 12px 24px;
            border-bottom: 1px solid #dadfeb;
            justify-content: space-between;
            display: flex;
            align-items: center;
            margin-top: 12px;
          }

          .todo.checked strong {
            text-decoration: line-through;
            opacity: 0.5;
          }

          button {
            border: 1px solid #eaedf8;
            padding: 12px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            border-radius: 4px;
          }
          button:hover {
            background: #f2f5fa;
          }
        `}</style>
      </div>
    </FadeIn>
  );
};

const AddInput = ({ onAdd }) => {
  const [txt, setTxt] = useState("");

  return (
    <div className="container">
      <input
        type="text"
        onChange={e => {
          setTxt(e.target.value);
        }}
        placeholder="Type something!"
      />
      <button onClick={() => onAdd(txt)}>Add todo</button>

      <style jsx>{`
        input {
          padding: 18px 24px;
          border: none;
          background: #fbfcfe;
          width: 100%;
          outline: none;
          font-size: 14px;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        input::placeholder {
          color: #8894af;
        }
        button {
          background: #eaedf8;
          border: none;
          border-left: 2px solid #dadfeb;
          padding: 12px;
          width: 120px;
          font-weight: bold;
          font-size: 14px;
          cursor: pointer;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        button:hover,
        input:hover {
          background: #f2f5fa;
        }
        .container {
          width: 100%;
          display: flex;
          flex-direction: row;
          border: 1px solid #eaedf8;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default () => {
  const [shared, setShared, isConnected] = useRoomService(
    client,
    "todos-demo-3"
  );

  function onAdd(title) {
    setShared(prevState => {
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
  }

  function checkTodo(id) {
    setShared(prevState => {
      // Sanity check
      if (!prevState.todos) {
        return;
      }

      const index = prevState.todos.findIndex(todo => todo.id === id);
      prevState.todos[index].checked = true;
    });
  }

  function removeTodo(id) {
    setShared(prevState => {
      // Sanity check
      if (!prevState.todos) {
        return;
      }

      const index = prevState.todos.findIndex(todo => todo.id === id);
      delete prevState.todos[index];
    });
  }

  const todos = Object.values(shared.todos || []).map((todo: any) => (
    <Todo todo={todo} key={todo.id} onCheck={checkTodo} onRemove={removeTodo} />
  ));

  return (
    <Centered>
      <h1>Ye' old TODO app</h1>
      <AddInput onAdd={onAdd} />
      {todos}
    </Centered>
  );
};
