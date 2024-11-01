import { Button } from "./ui/button";

export default function SchemaActions({
  isSubmitting,
  onGenerateSchema,
  onSendRequest
}) {
  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="default"
        onClick={onGenerateSchema}
        disabled={isSubmitting}
      >
        Generate Schema
      </Button>
      <Button onClick={onSendRequest} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Send Request"}
      </Button>
    </div>
  );
} 