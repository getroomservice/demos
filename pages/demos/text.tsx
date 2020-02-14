import { useRoomService } from "@roomservice/react";
import { Text } from "automerge";
import { useMemo, useState } from "react";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import client from "../../lib/client";
import { Centered } from "../../lib/ui";

const Editor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  // Keep track of state for the value of the editor.
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }]
    }
  ]);

  return (
    // @ts-ignore
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable />
    </Slate>
  );
};

export default () => {
  const [shared, setShared] = useRoomService<{
    text: Text;
  }>(client, "text-demo");

  return (
    <Centered>
      <h1>Type in the box!</h1>
      <Editor />
    </Centered>
  );
};
