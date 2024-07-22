import axios from "axios";
import { Button, FileInput, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";

interface FieldConfig {
  key: string;
  label: string;
  type: string;
  validator?: string;
  creatable: boolean;
  editable: boolean;
  target?: string;
  path?: string;
  identifier?: string;
}

interface EndpointConfig {
  users: {
    keys: FieldConfig[];
  };
  cards: {
    keys: FieldConfig[];
  };
  definitions: {
    keys: FieldConfig[];
  };
}

const DynamicForm: React.FC = () => {
  const [config, setConfig] = useState<EndpointConfig | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    axios
      .get("http://localhost:3333/endpoints")
      .then((response) => setConfig(response.data))
      .catch((error) => console.error("Failed to fetch configuration:", error));
  }, []);

  const handleInputChange = (key: string, value: any) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (!config) {
    return <div>Loading...</div>;
  }

  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case "Text":
        return (
          <div key={field.key} className="mb-4">
            <label
              htmlFor={field.key}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
            <TextInput
              id={field.key}
              name={field.key}
              type="text"
              className="mt-1 block w-full"
              onChange={(e) => handleInputChange(field.key, e.target.value)}
            />
          </div>
        );
      case "File":
        return (
          <div key={field.key} className="mb-4">
            <label
              htmlFor={field.key}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
            <FileInput
              id={field.key}
              name={field.key}
              className="mt-1 block w-full"
              onChange={(e) =>
                handleInputChange(
                  field.key,
                  e.target.files ? e.target.files[0] : null
                )
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      {config.users.keys.map((field) => renderField(field))}
      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </form>
  );
};

export default DynamicForm;
