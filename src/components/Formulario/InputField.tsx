import React from "react"

type InputFieldProps = {
    name: string;
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

export default function InputField({ name, value, onChange, placeholder }: InputFieldProps) {
    return (
        <input
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="border p-1 rounded w-full"
        />
    )
}
