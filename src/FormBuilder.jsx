import { useEffect, useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, PlusCircle, ArrowLeft } from "lucide-react";

// Field types
const FieldType = {
  TEXT: "text",
  NUMBER: "number",
  SELECT: "select",
  RADIO: "radio",
  CHECKBOX: "checkbox",
  DATE: "date",
  TEXTAREA: "textarea",
};

// Field Creation Component
const FieldCreationView = ({
  currentForm,
  currentSection,
  onSaveField,
  onBack,
}) => {
  const [fields, setFields] = useState([]); // Store multiple fields
  const [currentField, setCurrentField] = useState({
    fieldName: "",
    fieldType: FieldType.TEXT,
    label: "",
    required: false,
    placeholder: "",
    description: "",
    options: [],
    newOption: "",
  });

  const handleAddField = () => {
    const newField = {
      id: `FIELD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      name: currentField.fieldName,
      type: currentField.fieldType,
      label: currentField.label,
      required: currentField.required,
      placeholder: currentField.placeholder,
      description: currentField.description,
      options:
        currentField.fieldType === FieldType.SELECT ||
        currentField.fieldType === FieldType.RADIO
          ? currentField.options
          : undefined,
    };

    setFields([...fields, newField]); // Add field to the list
    resetField(); // Reset current field state
  };

  const resetField = () => {
    setCurrentField({
      fieldName: "",
      fieldType: FieldType.TEXT,
      label: "",
      required: false,
      placeholder: "",
      description: "",
      options: [],
      newOption: "",
    });
  };

  const handleSaveAllFields = () => {
    // Here you can generate the final JSON schema based on the fields array
    console.log(JSON.stringify(fields, null, 2));
    onSaveField(fields); // Pass the fields array to the parent component
  };

  const handleAddOption = () => {
    if (currentField.newOption) {
      setCurrentField((prev) => ({
        ...prev,
        options: [...prev.options, currentField.newOption],
        newOption: "", // Reset new option field
      }));
    }
  };

  return (
    <div className="p-4 flex-grow">
      <h2>Créer un Champ</h2>

      <Input
        type="text"
        placeholder="Nom du champ"
        value={currentField.fieldName}
        onChange={(e) =>
          setCurrentField({ ...currentField, fieldName: e.target.value })
        }
      />

      <Input
        type="text"
        placeholder="Label du champ"
        value={currentField.label}
        onChange={(e) =>
          setCurrentField({ ...currentField, label: e.target.value })
        }
      />

      <Input
        type="text"
        placeholder="Placeholder"
        value={currentField.placeholder}
        onChange={(e) =>
          setCurrentField({ ...currentField, placeholder: e.target.value })
        }
      />

      <Input
        type="text"
        placeholder="Description"
        value={currentField.description}
        onChange={(e) =>
          setCurrentField({ ...currentField, description: e.target.value })
        }
      />

      <select
        value={currentField.fieldType}
        onChange={(e) =>
          setCurrentField({ ...currentField, fieldType: e.target.value })
        }
      >
        <option value={FieldType.TEXT}>Texte</option>
        <option value={FieldType.SELECT}>Sélection</option>
        <option value={FieldType.RADIO}>Radio</option>
      </select>

      {/* Only show option input for select and radio types */}
      {(currentField.fieldType === FieldType.SELECT ||
        currentField.fieldType === FieldType.RADIO) && (
        <>
          <Input
            type="text"
            placeholder="Nouvelle option"
            value={currentField.newOption}
            onChange={(e) =>
              setCurrentField({ ...currentField, newOption: e.target.value })
            }
          />
          <Button onClick={handleAddOption}>Ajouter Option</Button>
          <div>
            <h4>Options:</h4>
            <ul>
              {currentField.options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      <label>
        <input
          type="checkbox"
          checked={currentField.required}
          onChange={(e) =>
            setCurrentField({ ...currentField, required: e.target.checked })
          }
        />
        Champ Requis
      </label>

      <Button
        onClick={handleAddField}
        disabled={!currentField.fieldName || !currentField.label}
      >
        Ajouter Champ
      </Button>

      {/* Save All Fields Button */}
      <Button onClick={handleSaveAllFields} disabled={fields.length === 0}>
        Enregistrer Tous les Champs
      </Button>

      {/* Optionally render the added fields */}
      <h3>Champs Ajoutés:</h3>
      <ul>
        {fields.map((field) => (
          <li key={field.id}>
            {field.label} ({field.type}) -{" "}
            {field.required ? "Requis" : "Facultatif"}
          </li>
        ))}
      </ul>

      <Button onClick={onBack}>Retour</Button>
    </div>
  );
};

// Usage example
const SomeParentComponent = () => {
  const handleSaveFields = (fields) => {
    // Handle the saved fields (e.g., save to state or send to backend)
    console.log(fields);
  };

  return (
    <FieldCreationView
      currentForm={currentForm}
      currentSection={currentSection}
      onSaveField={handleSaveFields}
      onBack={handleBack}
    />
  );
};

// Section Creation View Component
const SectionCreationView = ({
  currentForm,
  onSaveSection,
  onBack,
  onAddFields,
}) => {
  const [sectionName, setSectionName] = useState("");
  const [sectionType, setSectionType] = useState("");
  const [context, setContext] = useState("non");
  const [sectionCode, setSectionCode] = useState("");
  const [modifiable, setModifiable] = useState("non");
  const [illustration, setIllustration] = useState("non");

  const handleSaveSection = () => {
    const newSection = {
      name: sectionName,
      type: sectionType,
      context: context === "oui",
      code: sectionCode,
      modifiable: modifiable === "oui",
      illustration: illustration === "oui",
      fields: [],
    };

    onSaveSection(newSection);
    onAddFields(newSection);
  };

  return (
    <div className="p-4 flex-grow">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="mr-2" /> Retour
        </Button>
        <h2 className="text-2xl">
          Création de Section pour {currentForm?.name}
        </h2>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <Label>Nom de la Section</Label>
            <Input
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="Entrez le nom de la section"
            />
          </div>

          <div>
            <Label>Type de Section</Label>
            <Select onValueChange={setSectionType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="defaut">Défaut</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Contexte</Label>
            <RadioGroup
              value={context}
              onValueChange={setContext}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oui" id="context-oui" />
                <Label htmlFor="context-oui">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non" id="context-non" />
                <Label htmlFor="context-non">Non</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Code de Section</Label>
            <Input
              value={sectionCode}
              onChange={(e) => setSectionCode(e.target.value)}
              placeholder="Entrez le code de section"
            />
          </div>

          <div>
            <Label>Modifiable</Label>
            <RadioGroup
              value={modifiable}
              onValueChange={setModifiable}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oui" id="modifiable-oui" />
                <Label htmlFor="modifiable-oui">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non" id="modifiable-non" />
                <Label htmlFor="modifiable-non">Non</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Illustration</Label>
            <RadioGroup
              value={illustration}
              onValueChange={setIllustration}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oui" id="illustration-oui" />
                <Label htmlFor="illustration-oui">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non" id="illustration-non" />
                <Label htmlFor="illustration-non">Non</Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleSaveSection}
            disabled={!sectionName || !sectionType}
          >
            Enregistrer la Section
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// New Form View Component
const NewFormView = ({ onCreateForm }) => {
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("");

  const handleCreateForm = () => {
    const newForm = {
      name: formName,
      type: formType,
      code: `FORM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      sections: [],
    };
    onCreateForm(newForm);
  };

  return (
    <div className="p-4 flex-grow">
      <h2 className="text-2xl mb-4">Nouveau Formulaire</h2>
      <div className="space-y-4">
        <div>
          <Label>Nom du Formulaire</Label>
          <Input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Entrez le nom du formulaire"
          />
        </div>
        <div>
          <Label>Type de Formulaire</Label>
          <Select onValueChange={setFormType}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="note">Note</SelectItem>
              <SelectItem value="compte_rendu">Compte Rendu</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleCreateForm} disabled={!formName || !formType}>
          Créer le Formulaire
        </Button>
      </div>
    </div>
  );
};

// Form List View Component
const FormListView = ({
  forms,
  searchTerm,
  onSearchTermChange,
  onCreateNewForm,
}) => {
  const filteredForms = forms.filter((form) =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 flex-grow">
      <h2 className="text-2xl mb-4">Liste des Formulaires</h2>
      {filteredForms.map((form, index) => (
        <Card key={index} className="mb-2">
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <div className="font-bold">{form.name}</div>
              <div className="text-sm text-gray-500">{form.code}</div>
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de Formulaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="compte_rendu">Compte Rendu</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Sidebar Component
const Sidebar = ({
  searchTerm,
  onSearchTermChange,
  onCreateNewForm,
  onSearch,
}) => {
  return (
    <div className="w-64 p-4 border-r">
      <Input
        placeholder="Rechercher"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="mb-4"
      />
      <Button className="w-full mb-4" onClick={onSearch}>
        Rechercher
      </Button>
      <Button className="w-full" onClick={onCreateNewForm}>
        Nouveau
      </Button>
    </div>
  );
};

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
