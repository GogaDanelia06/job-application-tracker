"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";

interface JobApplicationData {
  company: string;
  position: string;
  location?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  columnId: string;
  boardId: string;
  tags?: string[];
  description?: string;
}

export async function createJobApplication(data: JobApplicationData) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await connectDB();

  const {
    company,
    position,
    location,
    notes,
    salary,
    jobUrl,
    columnId,
    boardId,
    tags,
    description,
  } = data;

  if (!company || !position || !columnId || !boardId) {
    return { error: "Missing required fields" };
  }

  const board = await Board.findOne({
    _id: boardId,
    userId: session.user.id,
  });

  if (!board) {
    return { error: "Board not found" };
  }

  const column = await Column.findOne({
    _id: columnId,
    boardId,
  });

  if (!column) {
    return { error: "Column not found" };
  }

  const maxOrder = (await JobApplication.findOne({ columnId })
    .sort({ order: -1 })
    .select("order")
    .lean()) as { order: number } | null;

  const jobApplication = await JobApplication.create({
    company,
    position,
    location,
    notes,
    salary,
    jobUrl,
    columnId,
    boardId,
    userId: session.user.id,
    tags: tags || [],
    description,
    status: "applied",
    order: maxOrder ? maxOrder.order + 100 : 0,
  });

  await Column.findByIdAndUpdate(columnId, {
    $addToSet: { jobApplications: jobApplication._id },
  });

  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(jobApplication)) };
}

export async function updateJobApplication(
  id: string,
  updates: {
    company?: string;
    position?: string;
    location?: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    columnId?: string;
    order?: number;
    tags?: string[];
    description?: string;
  }
) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await connectDB();

  const jobApplication = await JobApplication.findById(id);

  if (!jobApplication) {
    return { error: "Job application not found" };
  }

  if (jobApplication.userId.toString() !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const { columnId, order, ...otherUpdates } = updates;

  const currentColumnId = jobApplication.columnId.toString();
  const targetColumnId = columnId?.toString() || currentColumnId;

  const isMovingColumn = targetColumnId !== currentColumnId;
  const isReordering = order !== undefined && order !== null;

  if (isMovingColumn || isReordering) {
    if (isMovingColumn) {
      await Column.findByIdAndUpdate(currentColumnId, {
        $pull: { jobApplications: id },
      });

      await Column.findByIdAndUpdate(targetColumnId, {
        $addToSet: { jobApplications: id },
      });
    }

    const targetJobs = await JobApplication.find({
      columnId: targetColumnId,
      _id: { $ne: id },
    })
      .sort({ order: 1 })
      .lean();

    const newIndex = Math.max(
      0,
      Math.min(order ?? targetJobs.length, targetJobs.length)
    );

    const reorderedJobs = [
      ...targetJobs.slice(0, newIndex),
      jobApplication,
      ...targetJobs.slice(newIndex),
    ];

    for (let i = 0; i < reorderedJobs.length; i++) {
      await JobApplication.findByIdAndUpdate(reorderedJobs[i]._id, {
        $set: {
          order: i * 100,
          columnId: targetColumnId,
        },
      });
    }
  }

  const updated = await JobApplication.findByIdAndUpdate(
    id,
    {
      ...otherUpdates,
      columnId: targetColumnId,
    },
    { new: true }
  );

  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(updated)) };
}

export async function deleteJobApplication(id: string) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await connectDB();

  const jobApplication = await JobApplication.findById(id);

  if (!jobApplication) {
    return { error: "Job application not found" };
  }

  if (jobApplication.userId.toString() !== session.user.id) {
    return { error: "Unauthorized" };
  }

  await Column.findByIdAndUpdate(jobApplication.columnId, {
    $pull: { jobApplications: id },
  });

  await JobApplication.deleteOne({ _id: id });

  revalidatePath("/dashboard");

  return { success: true };
}