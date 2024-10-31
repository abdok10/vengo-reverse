// import { useEffect } from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, PlusCircle } from "lucide-react";

// Field types
// const FieldType = {
//   TEXT: "text",
//   NUMBER: "number",
//   SELECT: "select",
//   RADIO: "radio",
//   CHECKBOX: "checkbox",
//   DATE: "date",
//   TEXTAREA: "textarea",
// };

const FormSchemaBuilder = () => {
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [generatedSchema, setGeneratedSchema] = useState(null);

  // Reservation Status Options
  const RESERVATION_STATUSES = [
    { id: "1", name: "active" },
    { id: "2", name: "inactive" },
    { id: "3", name: "pending" },
  ];

  // Field type configurations
  const FIELD_TYPES = [
    {
      value: "text",
      options: ["short", "long"],
      hasCustomOptions: false,
    },
    {
      value: "number",
      options: ["integer", "decimal"],
      hasCustomOptions: false,
    },
    {
      value: "email",
      options: [],
      hasCustomOptions: false,
    },
    {
      value: "date",
      options: ["past", "future", "any"],
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
    },
    {
      value: "file",
      options: ["image", "document", "any"],
      hasCustomOptions: false,
    },
  ];

  // Add a new section
  const addSection = () => {
    setSections([
      ...sections,
      {
        name: `Section ${sections.length + 1}`,
        fields: [],
        required: false,
        reservation_status_name: "active",
        reservation_status_id: "1",
      },
    ]);
  };

  // Remove a section
  const removeSection = (sectionIndex) => {
    const newSections = sections.filter((_, index) => index !== sectionIndex);
    setSections(newSections);
  };

  // Add a field to a specific section
  const addField = (sectionIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].fields.push({
      name: `Field ${newSections[sectionIndex].fields.length + 1}`,
      type: "text",
      required: false,
      options: [],
      customOptions: "",
      reservation_status_name: "active",
      reservation_status_id: "2",
    });
    setSections(newSections);
  };

  // Remove a field from a section
  const removeField = (sectionIndex, fieldIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].fields.splice(fieldIndex, 1);
    setSections(newSections);
  };

  // Update field properties
  const updateField = (sectionIndex, fieldIndex, updates) => {
    const newSections = [...sections];
    newSections[sectionIndex].fields[fieldIndex] = {
      ...newSections[sectionIndex].fields[fieldIndex],
      ...updates,
    };
    setSections(newSections);
  };

  // Process custom options for select and checkbox
  const processCustomOptions = (optionsString) => {
    return optionsString
      .split(",")
      .map((option) => option.trim())
      .filter((option) => option !== "");
  };

  
  const generateSchema = () => {
    const schema = {
      name: formName,
      description: formDescription,
      account_id: 1, 
      template: sections.map((section) => ({
        section_name: section.name,
        required: section.required,
        reservation_status_name: section.reservation_status_name,
        reservation_status_id: section.reservation_status_id,
        fields: section.fields.map((field, index) => ({
          field_id: index + 1,
          name: field.name,
          type: field.type,
          options:
            field.type === "select" || field.type === "checkbox"
              ? processCustomOptions(field.customOptions)
              : field.options,
          required: field.required,
          reservation_status_name: field.reservation_status_name,
          reservation_status_id: field.reservation_status_id,
        })),
      })),
    };

    setGeneratedSchema(schema);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Form Schema Builder</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Form Details */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <Label>Form Name</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter form name"
              />
            </div>
            <div>
              <Label>Form Description</Label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter form description"
              />
            </div>
          </div>

          {/* Sections */}
          {sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="mb-4">
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2 w-full">
                    <Input
                      value={section.name}
                      onChange={(e) => {
                        const newSections = [...sections];
                        newSections[sectionIndex].name = e.target.value;
                        setSections(newSections);
                      }}
                      placeholder="Section Name"
                      className="flex-grow"
                    />

                    {/* Reservation Status for Section */}
                    <Select
                      value={section.reservation_status_id}
                      onValueChange={(value) => {
                        const newSections = [...sections];
                        const selectedStatus = RESERVATION_STATUSES.find(
                          (status) => status.id === value
                        );
                        newSections[sectionIndex].reservation_status_id = value;
                        newSections[sectionIndex].reservation_status_name =
                          selectedStatus.name;
                        setSections(newSections);
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Section Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESERVATION_STATUSES.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={section.required}
                        onCheckedChange={(checked) => {
                          const newSections = [...sections];
                          newSections[sectionIndex].required = checked;
                          setSections(newSections);
                        }}
                      />
                      <Label>Required</Label>
                    </div>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSection(sectionIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Fields in Section */}
                {section.fields.map((field, fieldIndex) => (
                  <Card key={fieldIndex} className="mb-2 p-4 relative">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeField(sectionIndex, fieldIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        value={field.name}
                        onChange={(e) =>
                          updateField(sectionIndex, fieldIndex, {
                            name: e.target.value,
                          })
                        }
                        placeholder="Field Name"
                      />

                      <Select
                        value={field.type}
                        onValueChange={(value) =>
                          updateField(sectionIndex, fieldIndex, {
                            type: value,
                            options: [], // Reset options when type changes
                            customOptions: "", // Reset custom options when type changes
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Field Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Reservation Status for Field */}
                      <Select
                        value={field.reservation_status_id}
                        onValueChange={(value) => {
                          const selectedStatus = RESERVATION_STATUSES.find(
                            (status) => status.id === value
                          );
                          updateField(sectionIndex, fieldIndex, {
                            reservation_status_id: value,
                            reservation_status_name: selectedStatus.name,
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Field Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {RESERVATION_STATUSES.map((status) => (
                            <SelectItem key={status.id} value={status.id}>
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="flex items-center">
                        <Checkbox
                          checked={field.required}
                          onCheckedChange={(checked) =>
                            updateField(sectionIndex, fieldIndex, {
                              required: checked,
                            })
                          }
                        />
                        <Label>Required</Label>
                      </div>
                    </div>

                    {/* Custom Options Input */}
                    {(field.type === "select" || field.type === "checkbox") && (
                      <div className="mt-2">
                        <Label>Custom Options (comma separated)</Label>
                        <Input
                          value={field.customOptions}
                          onChange={(e) =>
                            updateField(sectionIndex, fieldIndex, {
                              customOptions: e.target.value,
                            })
                          }
                          placeholder="Option1, Option2, Option3"
                        />
                      </div>
                    )}
                  </Card>
                ))}
                <Button onClick={() => addField(sectionIndex)} className="mt-2">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </CardContent>
            </Card>
          ))}
          <div className="flex items-center gap-4">
            <Button onClick={addSection} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Section
            </Button>

            {/* Generate Schema Button */}
            <Button onClick={generateSchema} className="mt-4">
              Generate Schema
            </Button>
          </div>

          {/* Display Generated Schema */}
          {generatedSchema && (
            <pre className="mt-4 bg-gray-100 p-4 rounded-md">
              {JSON.stringify(generatedSchema, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FormSchemaBuilder;
