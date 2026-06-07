import React from "react";
import { Button } from "@/components/atoms/button/button";
import { Type, AlignLeft, Image as ImageIcon, List as ListIcon } from "lucide-react";
import { BlockType } from "@/gql/graphql";

interface AddBlockToolbarProps {
  onAddBlock: (type: BlockType) => void;
}

export const AddBlockToolbar = ({ onAddBlock }: AddBlockToolbarProps) => {
  return (
    <div className="p-4 border border-border/40 rounded-xl bg-secondary/10 space-y-3">
      <span className="text-xs font-bold text-foreground block">
        Add New Content Block
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          type="button"
          size="sm"
          onClick={() => onAddBlock("HEADING")}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg text-xs"
        >
          <Type className="size-3.5 mr-1.5" />
          Heading
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => onAddBlock("PARAGRAPH")}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg text-xs"
        >
          <AlignLeft className="size-3.5 mr-1.5" />
          Paragraph
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => onAddBlock("IMAGE")}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg text-xs"
        >
          <ImageIcon className="size-3.5 mr-1.5" />
          Image
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => onAddBlock("LIST")}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg text-xs"
        >
          <ListIcon className="size-3.5 mr-1.5" />
          List
        </Button>
      </div>
    </div>
  );
};
