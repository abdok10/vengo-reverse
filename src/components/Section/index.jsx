import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChevronDown, ChevronRight, Trash2, PlusCircle } from "lucide-react";
import Field from "../Field";

export default function Section({
  section,
  sectionIndex,
  expanded,
  onRemove,
  onAddField,
  onRemoveField,
  onUpdateField,
  onToggle
}) {
  return (
    <Card className="bg-gray-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggle(sectionIndex)}
              className="p-1"
            >
              {expanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
            <Input
              value={section.name}
              onChange={(e) => onUpdateField(sectionIndex, "name", e.target.value)}
              placeholder="Section Name"
              className="bg-white w-64"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(sectionIndex)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4">
            {section.fields.map((field, fieldIndex) => (
              <Field
                key={fieldIndex}
                field={field}
                fieldIndex={fieldIndex}
                sectionIndex={sectionIndex}
                onRemove={onRemoveField}
                onUpdate={onUpdateField}
              />
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onAddField(sectionIndex)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 