interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold',
    ghost: 'text-gray-500 hover:text-blue-600',
  }

  return (
    <button
      className={`${variants[variant]} px-4 py-2 rounded-lg transition disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
