"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import EditJobApplicationDialog from "@/components/edit-job-dialog";
import {
  deleteJobApplication,
  updateJobApplication,
} from "@/lib/actions/job-applications";
import type { BoardColumn, JobApplication } from "./kanban-types";

type Props = {
  job: JobApplication;
  column: BoardColumn;
  columns: BoardColumn[];
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
  setColumns: React.Dispatch<React.SetStateAction<BoardColumn[]>>;
};

export default function JobCardMenu({
  job,
  column,
  columns,
  isPending,
  startTransition,
  setColumns,
}: Props) {
  function handleDelete() {
    startTransition(async () => {
      const result = await deleteJobApplication(job._id);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      setColumns((prev) =>
        prev.map((col) =>
          col._id === column._id
            ? {
                ...col,
                jobApplications: col.jobApplications?.filter(
                  (item) => item._id !== job._id
                ),
              }
            : col
        )
      );

      toast.success("Job deleted");
    });
  }

  function handleMove(targetColumnId: string) {
    startTransition(async () => {
      const result = await updateJobApplication(job._id, {
        columnId: targetColumnId,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      setColumns((prev) =>
        prev.map((col) => {
          if (col._id === column._id) {
            return {
              ...col,
              jobApplications: col.jobApplications?.filter(
                (item) => item._id !== job._id
              ),
            };
          }

          if (col._id === targetColumnId) {
            return {
              ...col,
              jobApplications: [...(col.jobApplications ?? []), job],
            };
          }

          return col;
        })
      );

      toast.success("Job moved");
    });
  }

  return (
    <>
      <EditJobApplicationDialog job={job} />

      {columns
        .filter((targetColumn) => targetColumn._id !== column._id)
        .map((targetColumn) => (
          <DropdownMenuItem
            key={targetColumn._id}
            disabled={isPending}
            onSelect={() => handleMove(targetColumn._id)}
          >
            Move to {targetColumn.name}
          </DropdownMenuItem>
        ))}

      <DropdownMenuItem
        disabled={isPending}
        onSelect={handleDelete}
        className="text-destructive focus:text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </>
  );
}