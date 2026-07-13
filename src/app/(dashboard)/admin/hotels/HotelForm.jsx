"use client";

import { Button, FieldError, Input, Label, ListBox, Select, TextField, toast } from "@heroui/react";
import { useState } from "react";
import { createHotel, updateHotel } from "@/service/hotels";

function validateField(name, value) {
  switch (name) {
    case "name":
      if (!value.trim()) return "Name is required";
      return "";
    case "city":
      if (!value.trim()) return "City is required";
      return "";
    default:
      return "";
  }
}

export default function HotelForm({ method, setIsOpen, selectedRow, onSuccess }) {
  const [form, setForm] = useState({
    name: selectedRow?.name || "",
    description: selectedRow?.description || "",
    address: selectedRow?.address || "",
    city: selectedRow?.city || "",
    state: selectedRow?.state || "",
    country: selectedRow?.country || "",
    latitude: selectedRow?.latitude || "",
    longitude: selectedRow?.longitude || "",
    isActive: selectedRow?.isActive ?? true,
    amenities: selectedRow?.amenities?.join(", ") || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fields = ["name", "city"];
    const newErrors = {};
    let hasError = false;
    for (const f of fields) {
      const err = validateField(f, form[f]);
      newErrors[f] = err;
      if (err) hasError = true;
    }
    setErrors(newErrors);
    if (hasError) return;

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        amenities: form.amenities ? form.amenities.split(",").map((a) => a.trim()).filter(Boolean) : [],
      };
      if (method === "Create") {
        await createHotel(payload);
      } else {
        await updateHotel(selectedRow.id, payload);
      }
      onSuccess();
      setIsOpen(false);
    } catch (err) {
      toast.danger(err.message || "Failed to save hotel");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField isRequired isInvalid={!!errors.name} name="name" value={form.name} onChange={handleChange("name")}>
        <Label>Hotel Name</Label>
        <Input placeholder="Hotel name" />
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </TextField>

      <TextField name="description" value={form.description} onChange={handleChange("description")}>
        <Label>Description</Label>
        <Input placeholder="Hotel description" />
      </TextField>

      <TextField name="address" value={form.address} onChange={handleChange("address")}>
        <Label>Address</Label>
        <Input placeholder="Full street address" />
      </TextField>

      <TextField isRequired isInvalid={!!errors.city} name="city" value={form.city} onChange={handleChange("city")}>
        <Label>City</Label>
        <Input placeholder="e.g. Delhi" />
        {errors.city && <FieldError>{errors.city}</FieldError>}
      </TextField>

      <div className="grid grid-cols-2 gap-4">
        <TextField name="state" value={form.state} onChange={handleChange("state")}>
          <Label>State</Label>
          <Input placeholder="e.g. Delhi" />
        </TextField>

        <TextField name="country" value={form.country} onChange={handleChange("country")}>
          <Label>Country</Label>
          <Input placeholder="e.g. India" />
        </TextField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField name="latitude" type="number" value={form.latitude} onChange={handleChange("latitude")}>
          <Label>Latitude</Label>
          <Input placeholder="e.g. 28.6139" />
        </TextField>

        <TextField name="longitude" type="number" value={form.longitude} onChange={handleChange("longitude")}>
          <Label>Longitude</Label>
          <Input placeholder="e.g. 77.2090" />
        </TextField>
      </div>

      <TextField name="amenities" value={form.amenities} onChange={handleChange("amenities")}>
        <Label>Amenities</Label>
        <Input placeholder="WiFi, Pool, Gym (comma separated)" />
      </TextField>

      <Select placeholder="Status" value={String(form.isActive)} onChange={(key) => handleChange("isActive")(key === "true")}>
        <Label>Status</Label>
        <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="true" textValue="Active">Active<ListBox.ItemIndicator /></ListBox.Item>
            <ListBox.Item id="false" textValue="Inactive">Inactive<ListBox.ItemIndicator /></ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>

      <div className="flex justify-end gap-2">
        <Button variant="tertiary" onPress={() => setIsOpen(false)}>Cancel</Button>
        <Button type="submit" isDisabled={submitting} color="primary">
          {submitting ? "Saving..." : method === "Create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
}
