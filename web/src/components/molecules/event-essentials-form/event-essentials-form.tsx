import React, { useRef } from "react";
import { Label } from "@/components/atoms/label/label";
import { Input } from "@/components/atoms/input/input";
import { Badge } from "@/components/atoms/badge/badge";
import { Button } from "@/components/atoms/button/button";
import { 
  Trash2, Type, AlignLeft, Image as ImageIcon, List as ListIcon, GripVertical 
} from "lucide-react";
import Image from "next/image";
import { DescriptionBlock, BlockType } from "../../organisms/create-event-form/types";

interface EventEssentialsFormProps {
  title: string;
  setTitle: (val: string) => void;
  headerImage: string;
  setHeaderImage: (val: string) => void;
  blocks: DescriptionBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<DescriptionBlock[]>>;
  onNext: (e: React.FormEvent | React.MouseEvent) => void;
}

export const EventEssentialsForm = ({
  title, setTitle, headerImage, setHeaderImage, blocks, setBlocks, onNext
}: EventEssentialsFormProps) => {
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
        level: type === "heading" ? "h2" : undefined,
        textSize: type === "paragraph" ? "base" : undefined,
        listStyle: type === "list" ? "disc" : undefined
      },
    ]);
  };

  const updateBlockField = (id: string, field: keyof DescriptionBlock, value: any) => {
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
      {/* SECTION 1: EVENT ESSENTIALS */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Step 1
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Event Essentials
          </h2>
          <p className="text-xs text-muted-foreground">
            Set the core identity of your event.
          </p>
        </div>

        <form id="create-event-form" onSubmit={(e) => { e.preventDefault(); onNext(e); }} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="headerImage">Header Image URL</Label>
              <Input
                id="headerImage"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={headerImage}
                onChange={(e) => setHeaderImage(e.target.value)}
              />
              {headerImage && (
                <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-xl border border-border shadow-sm">
                  <Image
                    src={headerImage}
                    alt="Header Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <hr className="border-border/40" />

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
              <div 
                key={block.id} 
                className="p-3 border border-border/60 rounded-xl flex items-start text-xs gap-4 bg-card cursor-move relative"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="mt-1 opacity-50 flex-shrink-0">
                  <GripVertical className="size-4" />
                </div>
                
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={null} className="bg-indigo-600/15 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300 border-0 text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded">
                      {block.type}
                    </Badge>
                  </div>
                  
                  {block.type === "heading" && (
                    <div className="flex items-center gap-2">
                      <select 
                        value={block.level || "h2"} 
                        onChange={(e) => updateBlockField(block.id, "level", e.target.value)}
                        className="h-9 px-2 text-xs border border-input rounded-md bg-transparent focus:ring-1 focus:ring-ring outline-none font-bold"
                      >
                        <option value="h1">H1</option>
                        <option value="h2">H2</option>
                        <option value="h3">H3</option>
                        <option value="h4">H4</option>
                        <option value="h5">H5</option>
                        <option value="h6">H6</option>
                      </select>
                      <Input
                        type="text"
                        placeholder="Section Heading"
                        value={block.content}
                        onChange={(e) => updateBlockField(block.id, "content", e.target.value)}
                        className="font-bold text-sm h-9 flex-1"
                      />
                    </div>
                  )}
                  
                  {block.type === "paragraph" && (
                    <div className="space-y-2">
                      <select 
                        value={block.textSize || "base"} 
                        onChange={(e) => updateBlockField(block.id, "textSize", e.target.value)}
                        className="h-8 px-2 text-xs border border-input rounded-md bg-transparent focus:ring-1 focus:ring-ring outline-none"
                      >
                        <option value="sm">Small Text</option>
                        <option value="base">Normal Text</option>
                        <option value="lg">Large Text</option>
                      </select>
                      <textarea
                        placeholder="Write your description here..."
                        value={block.content}
                        onChange={(e) => updateBlockField(block.id, "content", e.target.value)}
                        className="w-full min-h-[80px] p-2 bg-transparent border border-input rounded-md focus:ring-1 focus:ring-ring text-xs text-foreground placeholder:text-muted-foreground outline-none resize-y"
                      />
                    </div>
                  )}
                  
                  {block.type === "list" && (
                    <div className="space-y-2">
                      <select 
                        value={block.listStyle || "disc"} 
                        onChange={(e) => updateBlockField(block.id, "listStyle", e.target.value)}
                        className="h-8 px-2 text-xs border border-input rounded-md bg-transparent focus:ring-1 focus:ring-ring outline-none"
                      >
                        <option value="disc">Bullet List</option>
                        <option value="decimal">Numbered List</option>
                      </select>
                      <textarea
                        placeholder="Enter items (one per line)..."
                        value={block.content}
                        onChange={(e) => updateBlockField(block.id, "content", e.target.value)}
                        className="w-full min-h-[80px] p-2 bg-transparent border border-input rounded-md focus:ring-1 focus:ring-ring text-xs text-foreground placeholder:text-muted-foreground outline-none resize-y leading-relaxed"
                      />
                    </div>
                  )}
                  
                  {block.type === "image" && (
                    <div className="space-y-2">
                      <Input
                        type="url"
                        placeholder="Image URL..."
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        className="h-9 text-xs"
                      />
                      {block.content && (
                        <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-border/50">
                          <Image src={block.content} alt="Block preview" fill className="object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeBlock(block.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 active:scale-95 transition-all cursor-pointer"
                  aria-label="Remove block"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Block Toolbar */}
        <div className="p-4 border border-border/40 rounded-xl bg-secondary/10 space-y-3">
          <span className="text-xs font-bold text-foreground block">
            Add New Content Block
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              size="sm"
              onClick={() => addBlock("heading")}
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg text-xs"
            >
              <Type className="size-3.5 mr-1.5" />
              Heading
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => addBlock("paragraph")}
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg text-xs"
            >
              <AlignLeft className="size-3.5 mr-1.5" />
              Paragraph
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => addBlock("image")}
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg text-xs"
            >
              <ImageIcon className="size-3.5 mr-1.5" />
              Image
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => addBlock("list")}
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg text-xs"
            >
              <ListIcon className="size-3.5 mr-1.5" />
              List
            </Button>
          </div>
        </div>
      </div>

      <hr className="border-border/40" />

      {/* SUBMIT */}
      <Button
        type="button"
        onClick={onNext}
        className="w-full bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg py-2.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
      >
        Next
      </Button>
    </div>
  );
};

