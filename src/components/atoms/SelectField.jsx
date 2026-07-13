import { Description, FieldError, Label, ListBox, Select } from "@heroui/react";

function SelectField({
    label = "Select an option",
    placeholder = "Select one",
    description,
    fieldError,
    items = [],
    value,
    onChange,
    name,
    className = "w-[256px]",
    isDisabled,
    isRequired,
    isInvalid,
    selectionMode,
    disabledKeys,
    variant,
    fullWidth,
}) {
    return (
        <Select
            className={className}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            isDisabled={isDisabled}
            isRequired={isRequired}
            isInvalid={isInvalid}
            selectionMode={selectionMode}
            disabledKeys={disabledKeys}
            variant={variant}
            fullWidth={fullWidth}
        >
            <Label>{label}</Label>
            <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {items.map((item) => (
                        <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                            {item.name}
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
            {fieldError ? (
                <FieldError>{fieldError}</FieldError>
            ) : description ? (
                <Description>{description}</Description>
            ) : null}
        </Select>
    )
}

export default SelectField