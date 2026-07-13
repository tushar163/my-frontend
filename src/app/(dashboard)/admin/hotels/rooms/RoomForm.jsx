"use client";

import { Button, FieldError, Input, Label, ListBox, Select, TextField, toast } from "@heroui/react";
import { useState } from "react";
import { addRoom, updateRoom } from "@/service/hotels";

const ROOM_TYPES = [
  { id: "SINGLE", name: "Single" },
  { id: "DOUBLE", name: "Double" },
  { id: "SUITE", name: "Suite" },
  { id: "DELUXE", name: "Deluxe" },
  { id: "PENTHOUSE", name: "Penthouse" },
];

function validateField(name, value) {
  switch (name) {
    case "roomType":
      if (!value) return "Room type is required";
      return "";
    case "pricePerNight":
      if (!value) return "Price is required";
      if (isNaN(Number(value)) || Number(value) <= 0) return "Invalid price";
      return "";
    case "capacity":
      if (!value) return "Capacity is required";
      if (isNaN(Number(value)) || Number(value) <= 0) return "Invalid capacity";
      return "";
    case "totalRooms":
      if (!value) return "Total rooms is required";
      if (isNaN(Number(value)) || Number(value) <= 0) return "Invalid number";
      return "";
    default:
      return "";
  }
}

export default function RoomForm({ method, setIsOpen, selectedRow, hotelId, onSuccess }) {
  const [form, setForm] = useState({
    roomType: selectedRow?.roomType || "",
    pricePerNight: selectedRow?.pricePerNight || "",
    capacity: selectedRow?.capacity || "",
    totalRooms: selectedRow?.totalRooms || "",
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
    const fields = ["roomType", "pricePerNight", "capacity", "totalRooms"];
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
        pricePerNight: Number(form.pricePerNight),
        capacity: Number(form.capacity),
        totalRooms: Number(form.totalRooms),
        amenities: form.amenities ? form.amenities.split(",").map((a) => a.trim()).filter(Boolean) : [],
      };
      if (method === "Create") {
        await addRoom(hotelId, payload);
      } else {
        await updateRoom(selectedRow.id, payload);
      }
      onSuccess();
      setIsOpen(false);
    } catch (err) {
      toast.danger(err.message || "Failed to save room");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select isRequired isInvalid={!!errors.roomType} placeholder="Select type" value={form.roomType} onChange={(key) => handleChange("roomType")(key)}>
        <Label>Room Type</Label>
        <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
        <Select.Popover>
          <ListBox>
            {ROOM_TYPES.map((t) => (
              <ListBox.Item key={t.id} id={t.id} textValue={t.name}>{t.name}<ListBox.ItemIndicator /></ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
        {errors.roomType && <FieldError>{errors.roomType}</FieldError>}
      </Select>

      <TextField isRequired isInvalid={!!errors.pricePerNight} name="pricePerNight" type="number" value={form.pricePerNight} onChange={handleChange("pricePerNight")}>
        <Label>Price per Night</Label>
        <Input placeholder="0.00" />
        {errors.pricePerNight && <FieldError>{errors.pricePerNight}</FieldError>}
      </TextField>

      <div className="grid grid-cols-2 gap-4">
        <TextField isRequired isInvalid={!!errors.capacity} name="capacity" type="number" value={form.capacity} onChange={handleChange("capacity")}>
          <Label>Capacity</Label>
          <Input placeholder="e.g. 2" />
          {errors.capacity && <FieldError>{errors.capacity}</FieldError>}
        </TextField>

        <TextField isRequired isInvalid={!!errors.totalRooms} name="totalRooms" type="number" value={form.totalRooms} onChange={handleChange("totalRooms")}>
          <Label>Total Rooms</Label>
          <Input placeholder="e.g. 10" />
          {errors.totalRooms && <FieldError>{errors.totalRooms}</FieldError>}
        </TextField>
      </div>

      <TextField name="amenities" value={form.amenities} onChange={handleChange("amenities")}>
        <Label>Amenities</Label>
        <Input placeholder="WiFi, TV, AC (comma separated)" />
      </TextField>

      <div className="flex justify-end gap-2">
        <Button variant="tertiary" onPress={() => setIsOpen(false)}>Cancel</Button>
        <Button type="submit" isDisabled={submitting} color="primary">
          {submitting ? "Saving..." : method === "Create" ? "Add Room" : "Update"}
        </Button>
      </div>
    </form>
  );
}
