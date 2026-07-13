"use client";

import { addRoom, updateRoom } from "@/service/hotels";
import { Button, TextField, Label, Input, Description, TextArea, toast } from "@heroui/react";
import { useState } from "react";


const ROOM_TYPES = ["Standard", "Deluxe", "Suite", "Executive", "Family"];

export default function RoomForm({ method, setIsOpen, selectedRow, hotelId, onSuccess }) {
    const isEdit = method === "Edit";

    const [form, setForm] = useState({
        roomType: selectedRow?.roomType || "",
        pricePerNight: selectedRow?.pricePerNight ?? "",
        capacity: selectedRow?.capacity ?? "",
        totalRooms: selectedRow?.totalRooms ?? "",
        amenities: selectedRow?.amenities?.join(", ") || "",
        images: selectedRow?.images?.join(", ") || "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = () => {
        const next = {};
        if (!form.roomType.trim()) next.roomType = "Room type is required";
        if (!form.pricePerNight || Number(form.pricePerNight) <= 0)
            next.pricePerNight = "Enter a valid price";
        if (!form.capacity || Number(form.capacity) <= 0)
            next.capacity = "Enter a valid capacity";
        if (!form.totalRooms || Number(form.totalRooms) <= 0)
            next.totalRooms = "Enter a valid room count";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hotelId) {
            toast.danger("Select a hotel first");
            return;
        }
        if (!validate()) return;

        const payload = {
            roomType: form.roomType.trim(),
            pricePerNight: Number(form.pricePerNight),
            capacity: Number(form.capacity),
            totalRooms: Number(form.totalRooms),
            amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
            images: form.images.split(",").map((i) => i.trim()).filter(Boolean),
        };

        setIsSubmitting(true);
        try {
            if (isEdit) {
                await updateRoom(selectedRow.id, payload);
                toast.success("Room updated");
            } else {
                await addRoom(hotelId, payload);
                toast.success("Room added");
            }
            onSuccess?.();
            setIsOpen(false);
        } catch (err) {
            toast.danger(err?.message || "Failed to save room");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
                isRequired
                isInvalid={!!errors.roomType}
                className="w-full"
                name="roomType"
            >
                <Label>Room Type</Label>
                <select
                    className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none"
                    value={form.roomType}
                    onChange={(e) => handleChange("roomType", e.target.value)}
                >
                    <option value="">Select type</option>
                    {ROOM_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                {errors.roomType ? (
                    <Description>{errors.roomType}</Description>
                ) : (
                    <Description>Choose the category of room</Description>
                )}
            </TextField>

            <div className="grid grid-cols-2 gap-4">
                <TextField
                    isRequired
                    isInvalid={!!errors.pricePerNight}
                    className="w-full"
                    name="pricePerNight"
                >
                    <Label>Price / Night (₹)</Label>
                    <Input
                        type="number"
                        min="0"
                        placeholder="2500"
                        value={form.pricePerNight}
                        onChange={(e) => handleChange("pricePerNight", e.target.value)}
                    />
                    {errors.pricePerNight && <Description>{errors.pricePerNight}</Description>}
                </TextField>

                <TextField
                    isRequired
                    isInvalid={!!errors.capacity}
                    className="w-full"
                    name="capacity"
                >
                    <Label>Capacity (guests)</Label>
                    <Input
                        type="number"
                        min="1"
                        placeholder="2"
                        value={form.capacity}
                        onChange={(e) => handleChange("capacity", e.target.value)}
                    />
                    {errors.capacity && <Description>{errors.capacity}</Description>}
                </TextField>
            </div>

            <TextField
                isRequired
                isInvalid={!!errors.totalRooms}
                className="w-full"
                name="totalRooms"
            >
                <Label>Total Rooms Available</Label>
                <Input
                    type="number"
                    min="1"
                    placeholder="10"
                    value={form.totalRooms}
                    onChange={(e) => handleChange("totalRooms", e.target.value)}
                />
                {errors.totalRooms ? (
                    <Description>{errors.totalRooms}</Description>
                ) : (
                    <Description>How many rooms of this type exist</Description>
                )}
            </TextField>

            <TextField className="w-full" name="amenities">
                <Label>Amenities</Label>
                <TextArea
                    fullWidth
                    placeholder="WiFi, AC, TV, Mini Bar"
                    value={form.amenities}
                    onChange={(e) => handleChange("amenities", e.target.value)}
                />
                <Description>Comma-separated list</Description>
            </TextField>

            <TextField className="w-full" name="images">
                <Label>Image URLs</Label>
                <TextArea
                    fullWidth
                    placeholder="https://... , https://..."
                    value={form.images}
                    onChange={(e) => handleChange("images", e.target.value)}
                />
                <Description>Comma-separated list</Description>
            </TextField>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="tertiary" type="button" onPress={() => setIsOpen(false)}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting} className="bg-brand-navy text-ink-inverse">
                    {isEdit ? "Save Changes" : "Add Room"}
                </Button>
            </div>
        </form>
    );
}