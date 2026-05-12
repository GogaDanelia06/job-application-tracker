"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { updateJobApplication } from "@/lib/actions/job-applications";
import DroppableColumn from "./droppable-column";
import { COLUMN_CONFIG } from "./column-config";
import type {
  BoardColumn,
  JobApplication,
  KanbanBoardProps,
} from "./kanban-types";

export default function KanbanBoard({ board }: KanbanBoardProps) {
  const [activeJob, setActiveJob] = useState<JobApplication | null>(null);
  const [columns, setColumns] = useState<BoardColumn[]>([]);

  useEffect(() => {
    setColumns((board?.columns ?? []) as unknown as BoardColumn[]);
  }, [board]);

  if (!board) {
    return <div className="p-6 text-gray-500">No board found.</div>;
  }

  function findColumnByJobId(jobId: string) {
    return columns.find((column) =>
      column.jobApplications?.some((job) => job._id === jobId)
    );
  }

  function handleDragStart(event: DragStartEvent) {
    const job = event.active.data.current?.job as JobApplication | undefined;
    if (job) setActiveJob(job);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const activeJobId = active.id.toString();
    const overId = over.id.toString();

    if (activeJobId === overId) return;

    const sourceColumn = findColumnByJobId(activeJobId);
    const overColumn =
      columns.find((column) => column._id === overId) ||
      findColumnByJobId(overId);

    if (!sourceColumn || !overColumn) return;

    const sourceJobs = sourceColumn.jobApplications ?? [];
    const targetJobs = overColumn.jobApplications ?? [];
    const activeIndex = sourceJobs.findIndex((job) => job._id === activeJobId);
    const overIndex = targetJobs.findIndex((job) => job._id === overId);

    if (activeIndex === -1) return;

    const movingJob = sourceJobs[activeIndex];
    let newOrder = overIndex === -1 ? targetJobs.length : overIndex;

    if (sourceColumn._id === overColumn._id) {
      const finalIndex = overIndex === -1 ? targetJobs.length - 1 : overIndex;
      const reorderedJobs = arrayMove(sourceJobs, activeIndex, finalIndex);

      setColumns((prev) =>
        prev.map((column) =>
          column._id === sourceColumn._id
            ? { ...column, jobApplications: reorderedJobs }
            : column
        )
      );

      newOrder = finalIndex;
    } else {
      const newSourceJobs = sourceJobs.filter(
        (job) => job._id !== activeJobId
      );

      const newTargetJobs = [
        ...targetJobs.slice(0, newOrder),
        movingJob,
        ...targetJobs.slice(newOrder),
      ];

      setColumns((prev) =>
        prev.map((column) => {
          if (column._id === sourceColumn._id) {
            return { ...column, jobApplications: newSourceJobs };
          }

          if (column._id === overColumn._id) {
            return { ...column, jobApplications: newTargetJobs };
          }

          return column;
        })
      );
    }

    const result = await updateJobApplication(activeJobId, {
      columnId: overColumn._id,
      order: newOrder,
    });

    if (result?.error) toast.error(result.error);
  }

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-5 px-6 pb-10 md:grid-cols-5">
        {columns.map((col, index) => (
          <DroppableColumn
            key={col._id}
            column={col}
            columns={columns}
            setColumns={setColumns}
            config={COLUMN_CONFIG[index] || COLUMN_CONFIG[0]}
            boardId={board._id.toString()}
          />
        ))}
      </div>

      <DragOverlay>
        {activeJob ? (
          <Card className="bg-white border border-gray-200 shadow-xl rotate-2">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-sm">{activeJob.position}</h3>
              <p className="text-sm text-gray-500">{activeJob.company}</p>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}