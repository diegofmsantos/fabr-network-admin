import { UseFormRegister, FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  id: string;
  register: ReturnType<UseFormRegister<any>>;
  error?: FieldError;
  type?: "text" | "number" | "select";
  options?: { value: string | number; label: string }[];
  step?: string; // Adicionando a propriedade 'step' para inputs numéricos
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  register,
  error,
  type = "text",
  options,
  step,
}) => {
  return (
    <div className="mb-4 w-96">
      <label className="block text-sm font-bold mb-2" htmlFor={id}>
        {label}
      </label>

      {type === "select" ? (
        <select
          id={id}
          {...register}
          className="w-full px-3 py-2 border rounded outline-none"
        >
          <option value="">Selecione uma opção</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          {...register}
          type={type}
          step={type === "number" ? step : undefined}
          className="w-full px-3 py-2 border rounded outline-none"
        />
      )}

      {error && (
        <span className="text-red-500 text-sm">{error.message}</span>
      )}
    </div>
  );
};

export default FormField;
