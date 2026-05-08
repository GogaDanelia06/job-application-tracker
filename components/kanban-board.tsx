"use client";

import { Board, Column } from "@/lib/models/models.type";
import { Award, Calendar, CheckCircle2, Mic, MoreVertical, Trash2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import CreateJobApplicationDialog from "./create-job-dialog";

interface KanbanBoardProps {
  board: Board | null;
  userId: string;
}

interface ColConfig {
  color: string;
  icon: React.ReactNode;
}

const COLUMN_CONFIG: ColConfig[] = [
  { color: "bg-cyan-500", icon: <Calendar className="h-4 w-4" /> },
  { color: "bg-purple-500", icon: <CheckCircle2 className="h-4 w-4" /> },
  { color: "bg-green-500", icon: <Mic className="h-4 w-4" /> },
  { color: "bg-yellow-500", icon: <Award className="h-4 w-4" /> },
  { color: "bg-red-500", icon: <XCircle className="h-4 w-4" /> },
];

function DroppableColumn({
  column,
  config,
  boardId,
}: {
  column: Column;
  config: ColConfig;
  boardId: string;
}) {
  return (
<Card className="min-w-2xs flex-shrink-0 shadow-md p-0">
      <CardHeader
        className={`${config.color} text-white rounded-t-lg pb-3 pt-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <CardTitle className="text-white text-base font-semibold">
              {column.name}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-4 bg-gray-50/50 min-h-96 rounded-b-lg">
        <CreateJobApplicationDialog columnId={column._id} boardId={boardId} />
      </CardContent>
    </Card>
  );
}

export default function KanbanBoard({ board }: KanbanBoardProps) {
  if (!board) {
    return <div className="p-6 text-gray-500">No board found.</div>;
  }

  const columns = board.columns ?? [];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {columns.map((col, index) => {
          const config = COLUMN_CONFIG[index] || {
            color: "bg-gray-500",
            icon: <Calendar className="h-4 w-4" />,
          };

          return (
            <DroppableColumn
              key={col._id.toString()}
              column={col}
              config={config}
              boardId={board._id.toString()}
            />
          );
        })}
      </div>
    </div>
  );
}