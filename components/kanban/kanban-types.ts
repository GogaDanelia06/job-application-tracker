import type { Board } from "@/lib/models/models.type";

export type JobApplication = {
  _id: string;
  company: string;
  position: string;
  location?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  description?: string;
  tags?: string[];
};

export type BoardColumn = {
  _id: string;
  name: string;
  jobApplications?: JobApplication[];
};

export type KanbanBoardProps = {
  board: Board | null;
  userId: string;
};