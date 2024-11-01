import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import Section from "./Section";

export default function SectionList({
  sections,
  expandedSections,
  onAddSection,
  onRemoveSection,
  onAddField,
  onRemoveField,
  onUpdateField,
  onToggleSection
}) {
  return (
    <div className="space-y-4">
      {sections.map((section, sectionIndex) => (
        <Section
          key={sectionIndex}
          section={section}
          sectionIndex={sectionIndex}
          expanded={expandedSections[sectionIndex]}
          onRemove={onRemoveSection}
          onAddField={onAddField}
          onRemoveField={onRemoveField}
          onUpdateField={onUpdateField}
          onToggle={onToggleSection}
        />
      ))}
      <Button variant="outline" className="w-full" onClick={onAddSection}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Section
      </Button>
    </div>
  );
} 