"use client";

import { useState } from "react";

export const INITIAL_FORM_DATA = {
  company: "",
  position: "",
  location: "",
  salary: "",
  jobUrl: "",
  tags: "",
  description: "",
  notes: "",
};

export default function useJobForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  function resetForm() {
    setFormData(INITIAL_FORM_DATA);
  }

  return {
    formData,
    setFormData,
    resetForm,
  };
}