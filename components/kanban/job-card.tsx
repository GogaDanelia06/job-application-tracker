"use client";

import { Building2, ExternalLink, MapPin, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import JobCardMenu from "./job-card-menu";
import type { BoardColumn, JobApplication } from "./kanban-types";

type Props = {
  job: JobApplication;
  column: BoardColumn;
  columns: BoardColumn[];
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
  setColumns: React.Dispatch<React.SetStateAction<BoardColumn[]>>;
};

export default function JobCard(props: Props) {
  const { job } = props;

  return (
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
              <JobCardMenu {...props} />
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
          <p className="line-clamp-2 text-sm text-gray-500">{job.notes}</p>
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
  );
}