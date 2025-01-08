// components/Editor/FormField.tsx
interface FormFieldProps {
    label: string
    children: React.ReactNode
  }
  
  export const FormField = ({ label, children }: FormFieldProps) => {
    return (
      <div className="space-y-2">
        <label className="block text-white text-sm font-medium">{label}</label>
        {children}
      </div>
    )
  }