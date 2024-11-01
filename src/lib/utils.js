import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// FormBuilderUtils.js

export const RESERVATION_STATUSES = [
  { id: "1", name: "active" },
  { id: "2", name: "inactive" },
  { id: "3", name: "pending" },
];

export const FIELD_TYPES = [
  {
    value: "text",
    options: ["short", "long"],
    hasCustomOptions: false,
  },
  {
    value: "image",
    options: ["url", "base64"],
    hasCustomOptions: false,
  },
  {
    value: "date",
    options: ["past", "future"],
    hasCustomOptions: false,
  },
  {
    value: "select",
    options: [],
    hasCustomOptions: true,
  },
  {
    value: "checkbox",
    options: [],
    hasCustomOptions: true,
  }
];

export const processCustomOptions = (optionsString) => {
  return optionsString
    .split(",")
    .map((option) => option.trim())
    .filter((option) => option !== "");
};

export const validateSchema = (schema) => {
  // Validate form name
  if (!schema.name || schema.name.trim() === "") {
    throw new Error("Form name is required");
  }

  // Validate account_id
  if (!schema.account_id || schema.account_id < 1 || schema.account_id > 10) {
    throw new Error("Account ID must be between 1 and 10");
  }

  // Validate sections
  if (!schema.template || schema.template.length === 0) {
    throw new Error("At least one section is required");
  }

  schema.template.forEach((section, sectionIndex) => {
    // Validate section name
    if (!section.section_name || section.section_name.trim() === "") {
      throw new Error(`Section ${sectionIndex + 1} name is required`);
    }

    // Validate reservation_status_id
    const statusId = parseInt(section.reservation_status_id);
    if (isNaN(statusId) || statusId < 1 || statusId > 10) {
      throw new Error(`Section ${section.section_name} reservation status ID must be between 1 and 10`);
    }

    // Validate fields
    if (!section.fields || section.fields.length === 0) {
      throw new Error(`Section ${section.section_name} must have at least one field`);
    }

    section.fields.forEach((field) => {
      // Validate field name
      if (!field.name || field.name.trim() === "") {
        throw new Error(`Field name is required in section ${section.section_name}`);
      }

      // Validate reservation_status_id for field
      const fieldStatusId = parseInt(field.reservation_status_id);
      if (isNaN(fieldStatusId) || fieldStatusId < 1 || fieldStatusId > 10) {
        throw new Error(`Field ${field.name} reservation status ID must be between 1 and 10`);
      }

      // Validate field type specific options
      const fieldType = FIELD_TYPES.find(t => t.value === field.type);
      if (!fieldType) {
        throw new Error(`Invalid field type for ${field.name}`);
      }

      if (field.type === "select" || field.type === "checkbox") {
        if (!field.options || field.options.length === 0) {
          throw new Error(`Options are required for ${field.type} field "${field.name}"`);
        }
      }
    });
  });
}