"use client";

import { Button, FieldError, Input, Label, ListBox, Select, TextField, toast } from "@heroui/react";
import { useEffect, useState } from "react";
import { createProperty, updateProperty } from "@/service/properties";

const LISTING_TYPES = [
  { id: "BUY", name: "Buy" },
  { id: "RENT", name: "Rent" },
];

const PROPERTY_TYPES = [
  { id: "RESIDENTIAL", name: "Residential" },
  { id: "COMMERCIAL", name: "Commercial" },
  { id: "VILLA", name: "Villa" },
  { id: "APARTMENT", name: "Apartment" },
  { id: "LAND", name: "Land" },
  { id: "OFFICE", name: "Office" },
  { id: "PG", name: "PG" },
  { id: "WAREHOUSE", name: "Warehouse" },
];

function validateField(name, value) {
  switch (name) {
    case "title":
      if (!value.trim()) return "Title is required";
      return "";
    case "description":
      if (!value.trim()) return "Description is required";
      return "";
    case "listingType":
      if (!value) return "Listing type is required";
      return "";
    case "propertyType":
      if (!value) return "Property type is required";
      return "";
    case "price":
      if (!value) return "Price is required";
      if (isNaN(Number(value)) || Number(value) <= 0) return "Invalid price";
      return "";
    case "area":
      if (!value) return "Area is required";
      if (isNaN(Number(value)) || Number(value) <= 0) return "Invalid area";
      return "";
    case "city":
      if (!value.trim()) return "City is required";
      return "";
    default:
      return "";
  }
}

export default function PropertyForm({ method, setIsOpen, selectedRow, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    listingType: "",
    propertyType: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    furnished: false,
    address: "",
    city: "",
    state: "",
    country: "",
    amenities: "",
  });
  console.log("selectedRow", selectedRow , method);
  useEffect(() => {
    if (selectedRow && method === "Edit") {
      setForm({
        title: selectedRow.title || "",
        description: selectedRow.description || "",
        listingType: selectedRow.listingType || "",
        propertyType: selectedRow.propertyType || "",
        price: selectedRow.price || "",
        area: selectedRow.area || "",
        bedrooms: selectedRow.bedrooms || "",
        bathrooms: selectedRow.bathrooms || "",
        furnished: selectedRow.furnished ?? false,
        address: selectedRow.address || "",
        city: selectedRow.city || "",
        state: selectedRow.state || "",
        country: selectedRow.country || "",
        amenities: selectedRow.amenities?.join(", ") || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        listingType: "",
        propertyType: "",
        price: "",
        area: "",
        bedrooms: "",
        bathrooms: "",
        furnished: false,
        address: "",
        city: "",
        state: "",
        country: "",
        amenities: "",
      });
    }

  }, [selectedRow , method]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ["title", "description", "listingType", "propertyType", "price", "area", "city"];
    const newErrors = {};
    let hasError = false;
    for (const f of required) {
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
        price: Number(form.price),
        area: Number(form.area),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        amenities: form.amenities ? form.amenities.split(",").map((a) => a.trim()).filter(Boolean) : [],
      };
      if (method === "Create") {
        await createProperty(payload);
      } else {
        await updateProperty(selectedRow.id, payload);
      }
      onSuccess();
      setIsOpen(false);
    } catch (err) {
      toast.danger(err.message || "Failed to save property");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField isRequired isInvalid={!!errors.title} name="title" value={form.title} onChange={handleChange("title")}>
        <Label>Title</Label>
        <Input placeholder="Property title" />
        {errors.title && <FieldError>{errors.title}</FieldError>}
      </TextField>

      <TextField isRequired isInvalid={!!errors.description} name="description" value={form.description} onChange={handleChange("description")}>
        <Label>Description</Label>
        <Input placeholder="Brief description" />
        {errors.description && <FieldError>{errors.description}</FieldError>}
      </TextField>

      <div className="grid grid-cols-2 gap-4">
        <Select isRequired isInvalid={!!errors.listingType} placeholder="Select type" value={form.listingType} onChange={(key) => handleChange("listingType")(key)}>
          <Label>Listing Type</Label>
          <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
          <Select.Popover>
            <ListBox>
              {LISTING_TYPES.map((t) => (
                <ListBox.Item key={t.id} id={t.id} textValue={t.name}>{t.name}<ListBox.ItemIndicator /></ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
          {errors.listingType && <FieldError>{errors.listingType}</FieldError>}
        </Select>

        <Select isRequired isInvalid={!!errors.propertyType} placeholder="Select type" value={form.propertyType} onChange={(key) => handleChange("propertyType")(key)}>
          <Label>Property Type</Label>
          <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
          <Select.Popover>
            <ListBox>
              {PROPERTY_TYPES.map((t) => (
                <ListBox.Item key={t.id} id={t.id} textValue={t.name}>{t.name}<ListBox.ItemIndicator /></ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
          {errors.propertyType && <FieldError>{errors.propertyType}</FieldError>}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField isRequired isInvalid={!!errors.price} name="price" type="number" value={form.price} onChange={handleChange("price")}>
          <Label>Price</Label>
          <Input placeholder="0.00" />
          {errors.price && <FieldError>{errors.price}</FieldError>}
        </TextField>

        <TextField isRequired isInvalid={!!errors.area} name="area" type="number" value={form.area} onChange={handleChange("area")}>
          <Label>Area (sq.ft)</Label>
          <Input placeholder="0" />
          {errors.area && <FieldError>{errors.area}</FieldError>}
        </TextField>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <TextField name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange("bedrooms")}>
          <Label>Bedrooms</Label>
          <Input placeholder="0" />
        </TextField>

        <TextField name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange("bathrooms")}>
          <Label>Bathrooms</Label>
          <Input placeholder="0" />
        </TextField>

        <Select placeholder="Furnished?" value={form.furnished ? "true" : "false"} onChange={(key) => handleChange("furnished")(key === "true")}>
          <Label>Furnished</Label>
          <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="true" textValue="Yes">Yes<ListBox.ItemIndicator /></ListBox.Item>
              <ListBox.Item id="false" textValue="No">No<ListBox.ItemIndicator /></ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <TextField isRequired isInvalid={!!errors.city} name="city" value={form.city} onChange={handleChange("city")}>
        <Label>City</Label>
        <Input placeholder="e.g. Mumbai" />
        {errors.city && <FieldError>{errors.city}</FieldError>}
      </TextField>

      <div className="grid grid-cols-2 gap-4">
        <TextField name="state" value={form.state} onChange={handleChange("state")}>
          <Label>State</Label>
          <Input placeholder="Maharashtra" />
        </TextField>

        <TextField name="country" value={form.country} onChange={handleChange("country")}>
          <Label>Country</Label>
          <Input placeholder="India" />
        </TextField>
      </div>

      <TextField name="address" value={form.address} onChange={handleChange("address")}>
        <Label>Address</Label>
        <Input placeholder="Full address" />
      </TextField>

      <TextField name="amenities" value={form.amenities} onChange={handleChange("amenities")}>
        <Label>Amenities</Label>
        <Input placeholder="WiFi, Parking, AC (comma separated)" />
      </TextField>

      <div className="flex justify-end gap-2">
        <Button variant="tertiary" onPress={() => setIsOpen(false)}>Cancel</Button>
        <Button type="submit" isDisabled={submitting} color="primary">
          {submitting ? "Saving..." : method === "Create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
}
