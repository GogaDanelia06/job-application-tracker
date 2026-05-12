"use client";

import { useTransition } from "react";
import { useDroppable } from "@dnd-kit/core";
import { MoreVertical } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CreateJobApplicationDialog from "@/components/dialogs/create-job-dialog";
import SortableJobCard from "./sortable-job-card";
import JobCard from "./job-card";
import type { BoardColumn } from "./kanban-types";

type Props = {
  column: BoardColumn;
  columns: BoardColumn[];
  config: { color: string; icon: React.ReactNode };
  boardId: string;
  setColumns: React.Dispatch<React.SetStateAction<BoardColumn[]>>;
};

export default function DroppableColumn({
  column,
  columns,
  config,
  boardId,
  setColumns,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const jobs = column.jobApplications ?? [];

  const { setNodeRef } = useDroppable({
    id: column._id,
  });

  return (
    <Card className="w-full overflow-hidden rounded-xl border border-gray-200 shadow-md p-0">
      <CardHeader className={`${config.color} text-white pb-3 pt-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}

            <CardTitle className="text-white text-base font-semibold flex items-center">
              {column.name}
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {jobs.length}
              </span>
            </CardTitle>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent
        ref={setNodeRef}
        className="space-y-4 bg-gray-50/50 p-4 min-h-[640px]"
      >
        <SortableContext
          items={jobs.map((job) => job._id)}
          strategy={verticalListSortingStrategy}
        >
          {jobs.map((job) => (
            <SortableJobCard key={job._id} job={job}>
              <JobCard
                job={job}
                column={column}
                columns={columns}
                isPending={isPending}
                startTransition={startTransition}
                setColumns={setColumns}
              />
            </SortableJobCard>
          ))}
        </SortableContext>

        <CreateJobApplicationDialog columnId={column._id} boardId={boardId} />
      </CardContent>
    </Card>
  );
}