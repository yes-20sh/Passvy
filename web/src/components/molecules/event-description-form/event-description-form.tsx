import React, { useRef } from "react";
import { Button } from "@/components/atoms/button/button";
import { DescriptionBlock } from "@/interfaces/events/event.interface";
import { BlockType } from "@/gql/graphql";

import { ContentBlockItem } from "../content-block-item/content-block-item";
import { AddBlockToolbar } from "../add-block-toolbar/add-block-toolbar";

interface EventDescriptionFormProps {
  blocks: DescriptionBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<DescriptionBlock[]>>;
  onNext: (e: React.FormEvent | React.MouseEvent) => void;
  onBack: () => void;
  hasChanges?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
}

export const EventDescriptionForm = ({
  blocks, setBlocks, onNext, onBack, hasChanges = false, onSave, isSaving = false
}: EventDescriptionFormProps) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    dragOverItem.current = index;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const _blocks = [...blocks];
      const draggedItemContent = _blocks.splice(dragItem.current, 1)[0];
      _blocks.splice(dragOverItem.current, 0, draggedItemContent);
      setBlocks(_blocks);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const addBlock = (type: BlockType) => {
    setBlocks((prev) => [
      ...prev,
      { 
        id: Math.random().toString(), 
        type, 
        content: "",
        level: type === "HEADING" ? "h2" : undefined,
        textSize: type === "PARAGRAPH" ? "base" : undefined,
        listStyle: type === "LIST" ? "disc" : undefined
      },
    ]);
  };

  const updateBlockField = <K extends keyof DescriptionBlock>(id: string, field: K, value: DescriptionBlock[K]) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, content } : b))
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* SECTION 2: RICH DESCRIPTION */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Step 2
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Event Description
          </h2>
          <p className="text-xs text-muted-foreground">
            Build an engaging page for your event using headings, paragraphs, and images.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-foreground block">
            Content Blocks ({blocks.length})
          </span>
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <ContentBlockItem 
                key={block.id}
                block={block}
                index={index}
                onUpdateField={updateBlockField}
                onUpdateContent={updateBlock}
                onRemove={removeBlock}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </div>

        <AddBlockToolbar onAddBlock={addBlock} />
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
        >
          Back
        </Button>
        {hasChanges ? (
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            className="bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
