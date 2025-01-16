import { UseFormRegister, FieldError } from "react-hook-form"

interface FormFieldProps {
  label: string
  id: string
  register: ReturnType<UseFormRegister<any>>
  error?: FieldError
  type?: "text" | "number" | "select"
  options?: { value: string | number; label: string }[]
  step?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label, id, register, error, type = "text", options, step,
}) => {
  return (
    <div className="mb-4 w-full">
      <label className="block text-white text-sm font-medium mb-2" htmlFor={id}>
        {label}
      </label>

      {type === "select" ? (
        <select
          id={id}
          {...register}
          className="w-full px-3 py-2 bg-[#272731] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
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
          className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
        />
      )}

      {error && (
        <span className="text-red-500 text-sm mt-1">{error.message}</span>
      )}
    </div>
  )
}