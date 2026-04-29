interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function Input({ label, id, className = '', ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        id={inputId}
        aria-label={label}
        className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    </div>
  )
}
