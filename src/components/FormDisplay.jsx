import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import FormHeader from "./FormHeader";

const FormDisplay = ({ handleLogout }) => {
  const navigate = useNavigate();
//   const { formId } = useParams();

  const [formData, setFormData] = useState({});
  const [storedForm, setStoredForm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("currentFormSchema");
    if (stored) {
      setStoredForm(JSON.parse(stored));
    } else {
      toast.error("No form data found");
      navigate("/form-builder");
    }
  }, [navigate]);

  const handleInputChange = (
    sectionIndex,
    fieldIndex,
    value,
    sectionName,
    fieldName
  ) => {
    setFormData((prev) => ({
      ...prev,
      [`section${sectionIndex}-${sectionName}-${fieldName}`]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Structure the data in the desired format
      const formattedData = {
        form_name: storedForm.schema.name,
        form_description: storedForm.schema.description,
        account_id: storedForm.schema.account_id,
        template: storedForm.schema.template.map((section) => ({
          section_name: section.section_name,
          fields: section.fields.map((field) => ({
            field_name: field.name,
            type: field.type,
            required: field.required,
            options: field.options,
            value: formData[`section${sectionIndex}-${field.section_name}-${field.name}`],
          })),
        })),
      };

      console.log("Formatted Form Data:", formattedData);
      toast.success("Form submitted successfully");
    } catch (error) {
      toast.error("Failed to submit form");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field, sectionIndex, fieldIndex) => {
    const fieldValue = formData[`section${sectionIndex}-${field.section_name}-${field.name}`];

    switch (field.type) {
      case "text":
        return (
          <Input
            type="text"
            value={fieldValue || ""}
            onChange={(e) =>
              handleInputChange(
                sectionIndex,
                fieldIndex,
                e.target.value,
                field.section_name,
                field.name
              )
            }
            placeholder={`Enter ${field.name.toLowerCase()}`}
            required={field.required}
            className="bg-white"
          />
        );

      case "select":
        return (
          <Select
            value={fieldValue}
            onValueChange={(value) =>
              handleInputChange(
                sectionIndex,
                fieldIndex,
                value,
                field.section_name,
                field.name
              )
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option, i) => (
                <SelectItem key={i} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.section_name}-${field.name}-${i}`}
                  checked={
                    Array.isArray(fieldValue) && fieldValue.includes(option)
                  }
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(fieldValue)
                      ? fieldValue
                      : [];
                    const newValues = checked
                      ? [...currentValues, option]
                      : currentValues.filter((v) => v !== option);
                    handleInputChange(
                      sectionIndex,
                      fieldIndex,
                      newValues,
                      field.section_name,
                      field.name
                    );
                  }}
                />
                <Label htmlFor={`${field.section_name}-${field.name}-${i}`}>
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case "date":
        return (
          <Input
            type="date"
            value={fieldValue || ""}
            onChange={(e) =>
              handleInputChange(
                sectionIndex,
                fieldIndex,
                e.target.value,
                field.section_name,
                field.name
              )
            }
            placeholder={`Select ${field.name.toLowerCase()}`}
            required={field.required}
            className="bg-white"
          />
        );

      case "image":
        return (
          <Input
            type="text"
            value={fieldValue || ""}
            onChange={(e) =>
              handleInputChange(
                sectionIndex,
                fieldIndex,
                e.target.value,
                field.section_name,
                field.name
              )
            }
            placeholder={field.options?.[0] ? `Enter ${field.options[0]}` : `Enter URL for ${field.name.toLowerCase()}`}
            required={field.required}
            className="bg-white"
          />
        );

      default:
        return null;
    }
  };

  if (!storedForm?.schema) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-600">Loading form data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <FormHeader handleLogout={handleLogout} />

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-sky-700">Form Preview</h1>
          <Button variant="outline" onClick={() => navigate("/form-builder")}>
            Back to Form Builder
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{storedForm.schema.name}</CardTitle>
              {storedForm.schema.description && (
                <CardDescription>
                  {storedForm.schema.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {storedForm.schema.template.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="space-y-4 bg-gray-100 rounded-md p-4"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {section.section_name}
                      {section.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h3>
                  </div>

                  <div className="space-y-4 pl-4">
                    {section.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="space-y-2">
                        <Label>
                          {field.name}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        {renderField(field, sectionIndex, fieldIndex)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end space-x-2 mt-6">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  );
};

export default FormDisplay;
