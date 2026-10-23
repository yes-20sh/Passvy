import { ReactNode } from "react";
import { TypographyH3, TypographyMuted } from "@/components/atoms/typography/typography";

interface SettingsTemplateProps {
  title?: string;
  description?: string;
  header: ReactNode;
  sidebar: ReactNode;
  content: ReactNode;
  loading?: boolean;
  error?: string | boolean | null;
}

export function SettingsTemplate({
  title,
  description,
  header,
  sidebar,
  content,
  loading,
  error,
}: SettingsTemplateProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col">
      {header}

      <main className="container mx-auto py-10 max-w-4xl px-4 animate-in fade-in duration-500 flex-1">
        {(title || description) && (
          <div className="mb-8 space-y-1">
            {title && <TypographyH3>{title}</TypographyH3>}
            {description && <TypographyMuted className="text-base">{description}</TypographyMuted>}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive font-medium">
            {typeof error === "string" ? error : "Failed to load settings. Please try again later."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-start">
            <div className="md:col-span-1 space-y-6 md:sticky md:top-24">
              {sidebar}
            </div>

            <div className="md:col-span-2 space-y-6">
              {content}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
