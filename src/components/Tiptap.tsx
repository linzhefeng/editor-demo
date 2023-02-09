import React from "react";
import {
  EditorContent,
  useEditor,
  FloatingMenu,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import "./tiptap.scss";
import CustomBlockExtension, { Block } from "./tiptap/CustomBlockExtension";
import Paragraph from "@tiptap/extension-paragraph";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Focus from "@tiptap/extension-focus";
import Link from "@tiptap/extension-link";
import {
  mergeAttributes,
  Node,
  textblockTypeInputRule,
  nodeInputRule,
} from "@tiptap/core";
import Image from "@tiptap/extension-image";

const CustomImage = Image.extend({
  addNodeView() {
    return () => {
      const container = document.createElement("div");

      container.addEventListener("click", (event) => {
        alert("clicked on the container");
      });

      const content = document.createElement("div");
      content.innerText = "image";
      container.append(content);

      return {
        dom: container,
        contentDOM: content,
      };
    };
  },
});

export const customNode = Node.create({
  name: "mermaid",
  addNodeView() {
    return ReactNodeViewRenderer(Block);
  },
  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {},
      lowlight: {
        listLanguages() {
          return [];
        },
      },
    };
  },

  content: "text*",

  marks: "",

  group: "block",

  code: true,

  defining: true,

  //   addAttributes() {
  //     return {
  //       level: {
  //         default: 1,
  //         rendered: false,
  //       },
  //     };
  //   },

  //   parseHTML() {
  //     return this.options.levels.map((level: any) => ({
  //       tag: `h${level}`,
  //       attrs: { level },
  //     }));
  //   },

  //   renderHTML({ node, HTMLAttributes }) {
  //     const hasLevel = this.options.levels.includes(node.attrs.level);
  //     const level = hasLevel ? node.attrs.level : this.options.levels[0];

  //     return [
  //       `h${level}`,
  //       mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
  //       0,
  //     ];
  //   },
  addAttributes() {
    return {
      color: {
        default: "pink",
        renderHTML: (attributes) => {
          // … and return an object with HTML attributes.
          return {
            style: `color: ${attributes.color}`,
          };
        },
      },
      mode: {
        default: 1,
      },
      language: {
        default: null,
      },
      id: {
        default: "content",
      },
    };
  },

  addInputRules() {
    return this.options.levels.map((level) => {
      return textblockTypeInputRule({
        find: new RegExp(`^(@{1,${level}})\\s$`),
        type: this.type,
        getAttributes: {
          level,
        },
      });
    });
  },
});

const Tiptap = () => {
  const editor = useEditor({
    content: `
	<p>
	  That’s a boring paragraph followed by a fenced code block:
	</p>
	<pre><code >
flowchart TD
A[Start] --> B{Is it?};
B -- Yes --> C[OK];
C --> D[Rethink];
D --> B;
B -- No ----> E[End];</code></pre>
	<p>
	  Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.
	</p>
  `,
    extensions: [
      CustomImage,
      Link.configure({
        linkOnPaste: true,
      }),
      customNode,
      StarterKit,
      //   CustomBlockExtension,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Focus.configure({
        className: "has-focus",
        mode: "shallowest",
      }),
    ],
    autofocus: "end",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
      //   transformPastedText(text) {
      //     return text.toUpperCase();
      //   },
      //   transformPastedHTML(html, view) {
      //     console.log("html :>> ", html);
      //     return html.toUpperCase();
      //   },
    },
  });
  return (
    <div className="tip-body">
      <h2>tiptap editor</h2>
      {editor && (
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            h1
          </button>
          <button onClick={() => editor.chain().focus().insertTable().run()}>
            table
          </button>
          <button onClick={() => editor.chain().focus().toggleTaskList().run()}>
            task
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            code
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            bullet list
          </button>
        </FloatingMenu>
      )}
      <EditorContent className="editor" editor={editor} />
    </div>
  );
};

export default Tiptap;
