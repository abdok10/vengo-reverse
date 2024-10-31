import FormField from './FormField';

function FormSection({ section }) {
  return (
    <div>
      <h2>{section.section_name}</h2>
      {section.fields.map((field, index) => (
        <FormField key={index} field={field} />
      ))}
    </div>
  );
}

export default FormSection;
