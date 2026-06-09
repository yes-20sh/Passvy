import React from "react";

export interface EventEssentialsFormProps {
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
  onNext: (e: React.FormEvent | React.MouseEvent) => void;
  hasChanges?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
}
