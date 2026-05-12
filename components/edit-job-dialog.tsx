"use client";

import { useEffect, useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { updateJobApplication } from "@/lib/actions/job-applications";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Job = {
  _id: string;
  company: string;
  position: string;
  location?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  description?: string;
};

export default function EditJobApplicationDialog({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [company, setCompany] = useState(job.company ?? "");
  const [position, setPosition] = useState(job.position ?? "");
  const [location, setLocation] = useState(job.location ?? "");
  const [salary, setSalary] = useState(job.salary ?? "");
  const [jobUrl, setJobUrl] = useState(job.jobUrl ?? "");
  const [description, setDescription] = useState(job.description ?? "");
  const [notes, setNotes] = useState(job.notes ?? "");

  useEffect(() => {
    if (open) {
      setCompany(job.company ?? "");
      setPosition(job.position ?? "");
      setLocation(job.location ?? "");
      setSalary(job.salary ?? "");
      setJobUrl(job.jobUrl ?? "");
      setDescription(job.description ?? "");
      setNotes(job.notes ?? "");
    }
  }, [open, job]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      const result = await updateJobApplication(job._id, {
        company,
        position,
        location,
        salary,
        jobUrl,
        description,
        notes,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Job updated");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Edit Job Application</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <Input
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />

          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <Input
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />

          <Input
            placeholder="Job URL"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
          />

          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}