import React from "react";
import Image from "next/image";
import { Input } from "@/components/atoms/input/input";
import { Label } from "@/components/atoms/label/label";
import { Textarea } from "@/components/atoms/textarea/textarea";
import { Calendar } from "@/components/atoms/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/popover/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/atoms/dropdown-menu";
import { Button } from "@/components/atoms/button/button";
import { CalendarIcon, ChevronDown, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EventEssentialsFieldsProps {
  title: string;
  setTitle: (val: string) => void;
  headerImage: string;
  setHeaderImage: (val: string) => void;
  startDate: Date | undefined;
  setStartDate: (val: Date | undefined) => void;
  startTime: string;
  setStartTime: (val: string) => void;
  endDate: Date | undefined;
  setEndDate: (val: Date | undefined) => void;
  endTime: string;
  setEndTime: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  errors?: { [key: string]: string };
}

export const EventEssentialsFields = ({
  title,
  setTitle,
  headerImage,
  setHeaderImage,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  category,
  setCategory,
  errors
}: EventEssentialsFieldsProps) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="space-y-3">
        <Label htmlFor="title">Event Title</Label>
        <Textarea
          id="title"
          placeholder="Enter event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          />
        {errors?.title && <p className="text-xs text-destructive font-medium">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label>Start</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Popover>
                <PopoverTrigger render={
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-input shadow-sm h-10",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                } />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-[120px] shrink-0 relative flex items-center">
              <Clock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <Input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="shadow-sm pl-9 [&::-webkit-calendar-picker-indicator]:hidden"
              />
            </div>
          </div>
          {(errors?.startDate || errors?.startTime) && (
            <p className="text-xs text-destructive font-medium">{errors.startDate || errors.startTime}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label>End</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Popover>
                <PopoverTrigger render={
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-input shadow-sm h-10",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                } />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => {
                      const minDate = startDate ? new Date(startDate) : new Date();
                      minDate.setHours(0, 0, 0, 0);
                      return date < minDate;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-[130px] shrink-0 relative flex items-center">
              <Clock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <Input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="shadow-sm pl-9 [&::-webkit-calendar-picker-indicator]:hidden"
              />
            </div>
          </div>
          {(errors?.endDate || errors?.endTime) && (
            <p className="text-xs text-destructive font-medium">{errors.endDate || errors.endTime}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Event Category</Label>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full h-10 px-3 flex items-center justify-between text-sm border border-input rounded-md bg-transparent hover:bg-secondary/20 focus-visible:ring-1 focus-visible:ring-ring outline-none font-medium shadow-sm data-placeholder:text-muted-foreground">
            {category || <span className="text-muted-foreground">Select category</span>}
            <ChevronDown className="size-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-(--anchor-width)">
            {["Technology", "Music", "Business", "Sports", "Arts", "Health", "Food", "Other"].map((cat) => (
              <DropdownMenuItem
                key={cat}
                onClick={() => setCategory(cat)}
                className={category === cat ? "bg-accent font-bold" : ""}
              >
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {errors?.category && <p className="text-xs text-destructive font-medium">{errors.category}</p>}
      </div>

      <div className="space-y-3">
        <Label>Header Image</Label>
        
        {headerImage ? (
          <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-xl border border-border shadow-sm group">
            <Image
              src={headerImage}
              alt="Header Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label htmlFor="headerImage" className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-all">
                Change Image
              </label>
            </div>
            <input
              id="headerImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        ) : (
          <label 
            htmlFor="headerImage" 
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer bg-secondary/10 hover:bg-secondary/20 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-3 text-muted-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-muted-foreground/70">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input
              id="headerImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
};
