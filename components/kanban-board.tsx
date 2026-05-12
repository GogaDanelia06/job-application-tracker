"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import type { Board } from "@/lib/models/models.type";
import {
  DndContext,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Award,
  Calendar,
  CheckCircle2,
  Mic,
  MoreVertical,
  Trash2,
  XCircle,
  Building2,
  MapPin,
  ExternalLink,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

import CreateJobApplicationDialog from "./create-job-dialog";
import EditJobApplicationDialog from "./edit-job-dialog";

import {
  deleteJobApplication,
  updateJobApplication,
} from "@/lib/actions/job-applications";

type JobApplication = {
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

type BoardColumn = {
  _id: string;
  name: string;
  jobApplications?: JobApplication[];
};

interface KanbanBoardProps {
  board: Board | null;
  userId: string;
}

const COLUMN_CONFIG = [
  { color: "bg-cyan-500", icon: <Calendar className="h-4 w-4" /> },
  { color: "bg-purple-500", icon: <CheckCircle2 className="h-4 w-4" /> },
  { color: "bg-green-500", icon: <Mic className="h-4 w-4" /> },
  { color: "bg-yellow-500", icon: <Award className="h-4 w-4" /> },
  { color: "bg-red-500", icon: <XCircle className="h-4 w-4" /> },
];

function SortableJobCard({
  job,
  children,
}: {
  job: JobApplication;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job._id,
    data: {
      type: "job",
      job,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

function DroppableColumn({
  column,
  columns,
  config,
  boardId,
  setColumns,
}: {
  column: BoardColumn;
  columns: BoardColumn[];
  config: { color: string; icon: React.ReactNode };
  boardId: string;
  setColumns: React.Dispatch<React.SetStateAction<BoardColumn[]>>;
}) {
  const [isPending, startTransition] = useTransition();
  const jobs = column.jobApplications ?? [];

  const { setNodeRef } = useDroppable({
    id: column._id,
  });

  function handleDelete(jobId: string) {
    startTransition(async () => {
      const result = await deleteJobApplication(jobId);

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
                  (job) => job._id !== jobId
                ),
              }
            : col
        )
      );

      toast.success("Job deleted");
    });
  }

  function handleMove(job: JobApplication, targetColumnId: string) {
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
    <Card className="w-full overflow-hidden rounded-xl border border-gray-200 shadow-md p-0">
      <CardHeader
        className={`${config.color} text-white rounded-t-lg pb-3 pt-3`}
      >
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
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-gray-900">
                        {job.position}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Building2 className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          className="h-7 w-7 text-gray-500 hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-44"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EditJobApplicationDialog job={job} />

                        {columns
                          .filter(
                            (targetColumn) => targetColumn._id !== column._id
                          )
                          .map((targetColumn) => (
                            <DropdownMenuItem
                              key={targetColumn._id}
                              disabled={isPending}
                              onSelect={() =>
                                handleMove(job, targetColumn._id)
                              }
                            >
                              Move to {targetColumn.name}
                            </DropdownMenuItem>
                          ))}

                        <DropdownMenuItem
                          disabled={isPending}
                          onSelect={() => handleDelete(job._id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {job.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                  )}

                  {job.description && (
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {job.description}
                    </p>
                  )}

                  {job.notes && (
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {job.notes}
                    </p>
                  )}

                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {job.jobUrl && (
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex text-rose-400 hover:text-rose-500 transition"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </CardContent>
              </Card>
            </SortableJobCard>
          ))}
        </SortableContext>

        <CreateJobApplicationDialog columnId={column._id} boardId={boardId} />
      </CardContent>
    </Card>
  );
}

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

    if (job) {
      setActiveJob(job);
    }
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

    let newOrder = 0;

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
      const insertIndex = overIndex === -1 ? targetJobs.length : overIndex;

      const newSourceJobs = sourceJobs.filter(
        (job) => job._id !== activeJobId
      );

      const newTargetJobs = [
        ...targetJobs.slice(0, insertIndex),
        movingJob,
        ...targetJobs.slice(insertIndex),
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

      newOrder = insertIndex;
    }

    const result = await updateJobApplication(activeJobId, {
      columnId: overColumn._id,
      order: newOrder,
    });

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Job moved");
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
          <Card className="bg-white border border-gray-200 shadow-xl rotate-2 cursor-grabbing">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-sm text-gray-900">
                {activeJob.position}
              </h3>
              <p className="text-sm text-gray-500">{activeJob.company}</p>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}