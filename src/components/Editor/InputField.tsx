// components/Editor/InputField.tsx
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const InputField = (props: InputFieldProps) => {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
    />
  )
}