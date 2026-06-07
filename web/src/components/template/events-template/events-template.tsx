import React, { ReactNode } from "react";
import { ProtectedRoute } from "@/components/template/protected-route/protected-route";

interface EventsTemplateProps {
  header: ReactNode;
  featuredEvents?: ReactNode;
  categoryFilter?: ReactNode;
  eventsGrid?: ReactNode;
  content?: ReactNode;
}

export const EventsTemplate = ({
  header,
  featuredEvents,
  categoryFilter,
  eventsGrid,
  content,
}: EventsTemplateProps) => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col">
        {header}

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="space-y-8 max-w-7xl mx-auto w-full">
            {featuredEvents}
            {categoryFilter}
            {eventsGrid}
            {content}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};
