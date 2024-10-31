function FormField({ field }) {
    const { name, type, options, required } = field;
  
    const renderField = () => {
      switch (type) {
        case 'text':
          return <input type="text" name={name} required={required} />;
        case 'checkbox':
          return options.map((option, index) => (
            <label key={index}>
              <input type="checkbox" name={name} value={option} />
              {option}
            </label>
          ));
        case 'select':
          return (
            <select name={name} required={required}>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        case 'date':
          return <input type="date" name={name} required={required} />;
        case 'image':
          return (
            <select name={name} required={required}>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        default:
          return null;
      }
    };
  
    return (
      <div>
        <label>{name}</label>
        {renderField()}
      </div>
    );
  }
  
  export default FormField;
  