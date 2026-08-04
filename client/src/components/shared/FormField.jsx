function FormField({label, htmlFor, error, required, children}) {
    return (
        <div>
            {label && (
                <label htmlFor={htmlFor} className="block text-white font-medium mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {children}
            {error && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                    {error}
                </p>
            )}
        </div>
    )
}

export default FormField;