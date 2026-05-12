"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

export default function JobFormFields({
  formData,
  setFormData,
}: Props) {
  function updateField(key: string, value: string) {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div className="space-y-3">
      <Input
        placeholder="Company"
        value={formData.company}
        onChange={(e) => updateField("company", e.target.value)}
      />

      <Input
        placeholder="Position"
        value={formData.position}
        onChange={(e) => updateField("position", e.target.value)}
      />

      <Input
        placeholder="Location"
        value={formData.location}
        onChange={(e) => updateField("location", e.target.value)}
      />

      <Input
        placeholder="Salary"
        value={formData.salary}
        onChange={(e) => updateField("salary", e.target.value)}
      />

      <Input
        placeholder="Job URL"
        value={formData.jobUrl}
        onChange={(e) => updateField("jobUrl", e.target.value)}
      />

      <Input
        placeholder="Tags (comma separated)"
        value={formData.tags}
        onChange={(e) => updateField("tags", e.target.value)}
      />

      <Textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => updateField("description", e.target.value)}
      />

      <Textarea
        placeholder="Notes"
        value={formData.notes}
        onChange={(e) => updateField("notes", e.target.value)}
      />
    </div>
  );
}