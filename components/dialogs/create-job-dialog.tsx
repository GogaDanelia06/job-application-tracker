"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import useJobForm from "@/lib/hooks/use-job-form";
import { createJobApplication } from "@/lib/actions/job-applications";

import JobFormFields from "@/components/forms/job-form-fields";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  columnId: string;
  boardId: string;
};

export default function CreateJobApplicationDialog({
  columnId,
  boardId,
}: Props) {
  const [open, setOpen] = useState(false);

  const { formData, setFormData, resetForm } = useJobForm();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await createJobApplication({
      ...formData,
      columnId,
      boardId,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Job created");

    resetForm();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-dashed bg-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Job Application</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <JobFormFields
            formData={formData}
            setFormData={setFormData}
          />

          <Button type="submit" className="w-full">
            Create Job
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}