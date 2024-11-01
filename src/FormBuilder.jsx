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
import { Trash2, PlusCircle, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  RESERVATION_STATUSES,
  FIELD_TYPES,
  processCustomOptions,
  validateSchema,
} from "./lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "@/config";

const FormSchemaBuilder = ({ handleLogout }) => {
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [generatedSchema, setGeneratedSchema] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountId, setAccountId] = useState(1);
  const [expandedSections, setExpandedSections] = useState({});
  const navigate = useNavigate();

  const addSection = () => {
    setSections((prevSections) => [
      ...prevSections,
      {
        name: `Section ${prevSections.length + 1}`,
        fields: [],
        required: false,
        reservation_status_name: "active",
        reservation_status_id: "1",
      },
    ]);
  };

  const removeSection = (sectionIndex) => {
    setSections((prevSections) =>
      prevSections.filter((_, index) => index !== sectionIndex)
    );
  };

  const addField = (sectionIndex) => {
    setSections((prevSections) => {
      const newSections = [...prevSections];
      const isParentRequired = newSections[sectionIndex].required;
      
      newSections[sectionIndex].fields.push({
        name: `Field ${newSections[sectionIndex].fields.length + 1}`,
        type: "text",
        required: isParentRequired,
        options: "short",
        customOptions: "",
        reservation_status_name: "active",
        reservation_status_id: "1",
      });
      return newSections;
    });
  };

  const removeField = (sectionIndex, fieldIndex) => {
    setSections((prevSections) => {
      const newSections = [...prevSections];
      newSections[sectionIndex].fields.splice(fieldIndex, 1);
      return newSections;
    });
  };

  const updateField = (sectionIndex, fieldIndex, updates) => {
    setSections((prevSections) => {
      const newSections = [...prevSections];
      newSections[sectionIndex].fields[fieldIndex] = {
        ...newSections[sectionIndex].fields[fieldIndex],
        ...updates,
      };
      return newSections;
    });
  };

  const handleGenerateSchema = async () => {
    try {
      let currentFieldId = 1;

      sections.forEach((section) => {
        if (section.required) {
          const nonRequiredFields = section.fields.filter(
            (field) => !field.required
          );
          if (nonRequiredFields.length > 0) {
            throw new Error(
              `All fields in required section "${section.name}" must be marked as required`
            );
          }
        }
      });

      const schema = {
        name: formName.trim(),
        description: formDescription.trim() || null,
        account_id: parseInt(accountId),
        template: sections.map((section) => ({
          section_name: section.name.trim(),
          required: Boolean(section.required),
          reservation_status_name: section.reservation_status_name || "active",
          reservation_status_id: section.reservation_status_id,
          fields: section.fields.map((field) => {
            const fieldType = FIELD_TYPES.find((t) => t.value === field.type);
            let options = [];

            if (field.type === "select" || field.type === "checkbox") {
              options = processCustomOptions(field.customOptions);
            } else if (fieldType && fieldType.options.length > 0) {
              options = fieldType.options;
            }

            return {
              field_id: currentFieldId++,
              name: field.name.trim(),
              type: field.type,
              options: options,
              required: Boolean(field.required),
              reservation_status_name:
                field.reservation_status_name || "active",
              reservation_status_id: field.reservation_status_id,
            };
          }),
        })),
      };

      validateSchema(schema);
      setGeneratedSchema(schema);
      toast.success("Schema generated successfully");
      return schema;
    } catch (error) {
      toast.error(error.message || "Failed to generate schema");
      console.error("Error generating schema:", error);
      throw error;
    }
  };

  const handleSendRequest = async () => {
    try {
      if (!formName.trim()) {
        toast.error("Form name is required");
        return;
      }

      let token = localStorage.getItem("token")?.replace("Bearer ", "");
      if (!token) {
        toast.error("Please login again");
        handleLogout();
        return;
      }

      setIsSubmitting(true);
      const schema = await handleGenerateSchema();

      const response = await fetch(
        `https://xapi.vengoreserve.com/api/create/form`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(schema),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(data.message || "A form with this name already exists");
        }
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Store the schema and form data in localStorage
      localStorage.setItem('currentFormSchema', JSON.stringify({
        schema,
        formData: data,
        timestamp: new Date().toISOString()
      }));

      toast.success("Form submitted successfully");

      console.log({ data })
      const formId = data.id || 'new';
      navigate(`/form-display/${formId}`);

      setFormName("");
      setFormDescription("");
      setSections([]);
      setGeneratedSchema(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (sectionIndex) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <div className="text-3xl font-bold text-sky-700">Vengo Reverse</div>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="ml-auto"
        >
          Logout
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Form Schema Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <Label>Form Name</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter form name"
                className="bg-white"
              />
            </div>
            <div>
              <Label>Form Description</Label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter form description"
                className="bg-white"
              />
            </div>
          </div>
          <div className="mb-4">
            <Label>Account ID (1-10)</Label>
            <Input
              type="number"
              min="1"
              max="10"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-32 bg-white"
            />
          </div>

          {sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="mb-4 bg-gray-50">
              <CardContent className="py-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-between space-x-2 w-full">
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection(sectionIndex)}
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        {expandedSections[sectionIndex] ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </Button>
                      <span className="font-semibold text-lg text-sky-700">
                        {section.name}
                      </span>
                    </div>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSection(sectionIndex)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                {expandedSections[sectionIndex] && (
                  <div className="flex items-center space-x-2 w-full mt-2">
                    <Input
                      value={section.name}
                      onChange={(e) => {
                        const newSections = [...sections];
                        newSections[sectionIndex].name = e.target.value;
                        setSections(newSections);
                      }}
                      placeholder="Section Name"
                      className="flex-grow bg-white"
                    />
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
                      <SelectTrigger className="w-[180px] bg-white">
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
                          
                          if (checked) {
                            newSections[sectionIndex].fields = newSections[sectionIndex].fields.map((field) => ({
                              ...field,
                              required: true,
                            }));
                          }
                          
                          setSections(newSections);
                        }}
                      />
                      <Label>Required</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-gray-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              When a section is marked as required,
                              <br />
                              all fields within it will automatically
                              <br />
                              become required
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                )}

                {expandedSections[sectionIndex] && (
                  <>
                    {section.fields.map((field, fieldIndex) => (
                      <Card key={fieldIndex} className="my-4 bg-gray-100">
                        <CardContent className="py-4">
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                value={field.name}
                                onChange={(e) =>
                                  updateField(sectionIndex, fieldIndex, {
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Field Name"
                                className="bg-white"
                              />

                              <Select
                                value={field.type}
                                onValueChange={(value) => {
                                  let defaultOptions = "";
                                  if (value === "text")
                                    defaultOptions = "short";
                                  else if (value === "image")
                                    defaultOptions = "URL";
                                  else if (value === "date")
                                    defaultOptions = "past";

                                  updateField(sectionIndex, fieldIndex, {
                                    type: value,
                                    options: defaultOptions,
                                    customOptions: "",
                                  });
                                }}
                              >
                                <SelectTrigger className="w-full bg-white">
                                  <SelectValue placeholder="Field Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {FIELD_TYPES.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                    >
                                      {type.value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {field.type === "text" && (
                              <div className="space-y-2">
                                <Label>Text Options</Label>
                                <Select
                                  value={field.options}
                                  defaultValue="short"
                                  onValueChange={(value) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      options: value,
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="Select a text option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="short">Short</SelectItem>
                                    <SelectItem value="long">Long</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {field.type === "image" && (
                              <div className="space-y-2">
                                <Label>Image Options</Label>
                                <Select
                                  value={field.options}
                                  defaultValue="URL"
                                  onValueChange={(value) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      options: value,
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="Select an image option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="URL">URL</SelectItem>
                                    <SelectItem value="base64">
                                      Base64
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {field.type === "date" && (
                              <div className="space-y-2">
                                <Label>Date Options</Label>
                                <Select
                                  value={field.options}
                                  defaultValue="past"
                                  onValueChange={(value) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      options: value,
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="Select a date option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="past">Past</SelectItem>
                                    <SelectItem value="future">
                                      Future
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {(field.type === "select" ||
                              field.type === "checkbox") && (
                              <div className="space-y-2">
                                <Label>Custom Options (comma-separated)</Label>
                                <Input
                                  value={field.customOptions}
                                  onChange={(e) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      customOptions: e.target.value,
                                    })
                                  }
                                  placeholder="Option 1, Option 2, Option 3"
                                  className="bg-white"
                                />
                              </div>
                            )}

                            <div className="flex items-center space-x-2 pt-2">
                              <Select
                                value={field.reservation_status_id}
                                onValueChange={(value) => {
                                  const selectedStatus =
                                    RESERVATION_STATUSES.find(
                                      (status) => status.id === value
                                    );
                                  updateField(sectionIndex, fieldIndex, {
                                    reservation_status_id: value,
                                    reservation_status_name:
                                      selectedStatus.name,
                                  });
                                }}
                              >
                                <SelectTrigger className="w-[180px] bg-white">
                                  <SelectValue placeholder="Field Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {RESERVATION_STATUSES.map((status) => (
                                    <SelectItem
                                      key={status.id}
                                      value={status.id}
                                    >
                                      {status.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={field.required}
                                  onCheckedChange={(checked) => {
                                    const newSections = [...sections];
                                    newSections[sectionIndex].fields[fieldIndex].required = checked;

                                    const allFieldsRequired = newSections[sectionIndex].fields.every(
                                      (field) => field.required
                                    );
                                    newSections[sectionIndex].required = allFieldsRequired;

                                    setSections(newSections);
                                  }}
                                />
                                <Label>Required</Label>
                              </div>

                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() =>
                                  removeField(sectionIndex, fieldIndex)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => addField(sectionIndex)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            className="w-full my-4"
            onClick={addSection}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Section
          </Button>
          <div className="flex justify-end space-x-2">
            <Button
              variant="default"
              onClick={handleGenerateSchema}
              disabled={isSubmitting}
            >
              Generate Schema
            </Button>

            <Button onClick={handleSendRequest} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Send Request"}
            </Button>
          </div>

          {generatedSchema && (
            <Card className="my-4">
              <CardHeader>
                <CardTitle>Generated Schema</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-700 text-white p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(generatedSchema, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FormSchemaBuilder;
