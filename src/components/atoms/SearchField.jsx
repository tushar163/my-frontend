import { Description, FieldError, Label, SearchField } from "@heroui/react";

export function ReusableSearchField({
    label = "Search",
    placeholder = "Search...",
    description,
    fieldError,
    value,
    onChange,
    onSubmit,
    onClear,
    name,
    className,
    isDisabled,
    isInvalid,
    isRequired,
    variant,
    fullWidth,
}) {
    return (
        <SearchField
            className={className}
            name={name}
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            onClear={onClear}
            isDisabled={isDisabled}
            isInvalid={isInvalid}
            isRequired={isRequired}
            variant={variant}
            fullWidth={fullWidth}
        >
            <Label>{label}</Label>
            <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder={placeholder} />
                <SearchField.ClearButton />
            </SearchField.Group>
            {fieldError ? (
                <FieldError>{fieldError}</FieldError>
            ) : description ? (
                <Description>{description}</Description>
            ) : null}
        </SearchField>
    )
}