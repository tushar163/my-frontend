import { Description, FieldError, Input, Label, TextField } from '@heroui/react'

function InputField({
    label = "Full Name",
    placeholder = "Enter value",
    description,
    fieldError,
    isRequired,
    isInvalid,
    isDisabled,
    isReadOnly,
    value,
    onChange,
    type = "text",
    name,
    className = "w-full max-w-64",
}) {
    return (
        <TextField
            className={className}
            isRequired={isRequired}
            isInvalid={isInvalid}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
        >
            <Label>{label}</Label>
            <Input placeholder={placeholder} />
            {fieldError ? (
                <FieldError>{fieldError}</FieldError>
            ) : description ? (
                <Description>{description}</Description>
            ) : null}
        </TextField>
    )
}

export default InputField