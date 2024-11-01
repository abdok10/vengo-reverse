import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Trash2 } from "lucide-react";
import { FIELD_TYPES } from "../../lib/constants";

export default function Field({
  field,
  fieldIndex,
  sectionIndex,
  onRemove,
  onUpdate
}) {
  return (
    <div className="flex items-center space-x-2">
      <Input
        value={field.name}
        onChange={(e) =>
          onUpdate(sectionIndex, fieldIndex, { name: e.target.value })
        }
        placeholder="Field Name"
        className="bg-white"
      />
      <Select
        value={field.type}
        onValueChange={(value) =>
          onUpdate(sectionIndex, fieldIndex, { type: value })
        }
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Field Type" />
        </SelectTrigger>
        <SelectContent>
          {FIELD_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => onRemove(sectionIndex, fieldIndex)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
} 