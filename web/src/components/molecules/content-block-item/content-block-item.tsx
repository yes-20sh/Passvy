import React from "react";
import { Badge } from "@/components/atoms/badge/badge";
import { GripVertical, Trash2, ChevronDown } from "lucide-react";
import Image from "next/image";
import { DescriptionBlock } from "@/interfaces/events/event.interface";
import { Textarea } from "@/components/atoms/textarea/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/atoms/dropdown-menu";

interface ContentBlockItemProps {
  block: DescriptionBlock;
  index: number;
  onUpdateField: <K extends keyof DescriptionBlock>(id: string, field: K, value: DescriptionBlock[K]) => void;
  onUpdateContent: (id: string, content: string) => void;
  onRemove: (id: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnter: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const ContentBlockItem = ({
  block,
  index,
  onUpdateField,
  onUpdateContent,
  onRemove,
  onDragStart,
  onDragEnter,
  onDrop,
}: ContentBlockItemProps) => {
  return (
    <div
      className="p-3 border border-border/60 rounded-xl flex items-start text-xs gap-4 bg-card cursor-move relative"
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="mt-1 opacity-50 flex-shrink-0">
        <GripVertical className="size-4" />
      </div>

      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge
              variant={null}
              className="h-7 flex items-center bg-indigo-600/15 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300 border-0 text-[10px] font-extrabold uppercase px-2 rounded-md"
            >
              {block.type}
            </Badge>

            {block.type === "HEADING" && (
              <DropdownMenu>
                <DropdownMenuTrigger className="h-7 px-2 flex items-center gap-1 text-xs border border-input rounded-md bg-transparent hover:bg-secondary/20 focus-visible:ring-1 focus-visible:ring-ring outline-none font-bold">
                  {block.level ? block.level.toUpperCase() : "H2"}
                  <ChevronDown className="size-3 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[80px]">
                  {(["h1", "h2", "h3", "h4", "h5", "h6"] as const).map((h) => (
                    <DropdownMenuItem
                      key={h}
                      onClick={() => onUpdateField(block.id, "level", h)}
                      className={block.level === h ? "bg-accent" : ""}
                    >
                      {h.toUpperCase()}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {block.type === "PARAGRAPH" && (
              <DropdownMenu>
                <DropdownMenuTrigger className="h-7 px-2 flex items-center gap-1 text-xs border border-input rounded-md bg-transparent hover:bg-secondary/20 focus-visible:ring-1 focus-visible:ring-ring outline-none">
                  {block.textSize === "sm" ? "Small Text" : block.textSize === "lg" ? "Large Text" : "Normal Text"}
                  <ChevronDown className="size-3 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[120px]">
                  <DropdownMenuItem onClick={() => onUpdateField(block.id, "textSize", "sm")} className={block.textSize === "sm" ? "bg-accent" : ""}>Small Text</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdateField(block.id, "textSize", "base")} className={(!block.textSize || block.textSize === "base") ? "bg-accent" : ""}>Normal Text</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdateField(block.id, "textSize", "lg")} className={block.textSize === "lg" ? "bg-accent" : ""}>Large Text</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {block.type === "LIST" && (
              <DropdownMenu>
                <DropdownMenuTrigger className="h-7 px-2 flex items-center gap-1 text-xs border border-input rounded-md bg-transparent hover:bg-secondary/20 focus-visible:ring-1 focus-visible:ring-ring outline-none">
                  {block.listStyle === "decimal" ? "Numbered List" : "Bullet List"}
                  <ChevronDown className="size-3 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[120px]">
                  <DropdownMenuItem onClick={() => onUpdateField(block.id, "listStyle", "disc")} className={(!block.listStyle || block.listStyle === "disc") ? "bg-accent" : ""}>Bullet List</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdateField(block.id, "listStyle", "decimal")} className={block.listStyle === "decimal" ? "bg-accent" : ""}>Numbered List</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <button
            type="button"
            onClick={() => onRemove(block.id)}
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 active:scale-95 transition-all cursor-pointer"
            aria-label="Remove block"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        {block.type === "HEADING" && (
          <Textarea
            placeholder="Section Heading"
            value={block.content}
            onChange={(e) => onUpdateField(block.id, "content", e.target.value)}
            className="font-bold text-sm min-h-[40px] w-full"
            rows={1}
          />
        )}

        {block.type === "PARAGRAPH" && (
          <Textarea
            placeholder="Write your description here..."
            value={block.content}
            onChange={(e) => onUpdateField(block.id, "content", e.target.value)}
            className="w-full text-xs text-foreground"
            rows={3}
          />
        )}

        {block.type === "LIST" && (
          <div className="relative flex w-full rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <div className="flex flex-col items-end pt-2 pb-2 pl-3 pr-2 bg-secondary/10 border-r border-input text-muted-foreground select-none font-mono text-xs">
              {block.content.split('\n').map((_, i) => (
                <div key={i} className="h-5 flex items-center justify-end min-w-[12px]">
                  {block.listStyle === 'decimal' ? `${i + 1}.` : '•'}
                </div>
              ))}
            </div>
            <Textarea
              placeholder="Enter items (one per line)..."
              value={block.content}
              onChange={(e) => onUpdateField(block.id, "content", e.target.value)}
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none shadow-none text-xs text-foreground bg-transparent"
              rows={Math.max(3, block.content.split('\n').length)}
              style={{ lineHeight: '20px' }}
            />
          </div>
        )}

        {block.type === "IMAGE" && (
          <div className="space-y-2">
            {block.content ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border shadow-sm group">
                <Image
                  src={block.content}
                  alt="Block preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label htmlFor={`image-upload-${block.id}`} className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-all">
                    Change Image
                  </label>
                </div>
                <input
                  id={`image-upload-${block.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onUpdateContent(block.id, URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </div>
            ) : (
              <label 
                htmlFor={`image-upload-${block.id}`} 
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer bg-secondary/10 hover:bg-secondary/20 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-3 text-muted-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-muted-foreground/70">SVG, PNG, JPG or GIF</p>
                </div>
                <input
                  id={`image-upload-${block.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onUpdateContent(block.id, URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
