"use client"

import { Board } from "@/lib/models/models.type"

interface KanbanBoardProps {
    board: Board;
    userId: String;
}

export default function KanbanBoard ({ board, userId }: KanbanBoardProps) {
    return (
        <>
        <div>
            <div>
                </div>
                </div>
                </>
    );
} 