import { useState } from "react";
import Milkdown from "./components/Milkdown";
import Tiptap from "./components/Tiptap";

function App() {
  return (
    <div className="container">
      <Milkdown />
      <Tiptap />
    </div>
  );
}

export default App;
