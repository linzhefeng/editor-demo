import React from "react";
import { Editor, rootCtx } from "@milkdown/core";
import { ReactEditor, useEditor, useNodeCtx } from "@milkdown/react";
import { commonmark, paragraph, image } from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import "./milkdown.scss";

const CustomParagraph: React.FC = ({ children }) => (
  <div className="react-paragraph">{children}</div>
);

const CustomImage: React.FC = ({ children }) => {
  const { node } = useNodeCtx();

  return (
    <img
      className="react-image"
      src={node.attrs.src}
      alt={node.attrs.alt}
      title={node.attrs.title}
    />
  );
};

const MilkdownEditor: React.FC = () => {
  const { editor } = useEditor((root, renderReact) => {
    const nodes = commonmark
      .configure(paragraph, { view: renderReact(CustomParagraph) })
      .configure(image, { view: renderReact(CustomImage) });

    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
      })
      .use(nodes)
      .use(nord)
      .use(commonmark);
  });

  return (
    <div className="milk-body">
      <ReactEditor editor={editor} />
    </div>
  );
};

export default MilkdownEditor;
