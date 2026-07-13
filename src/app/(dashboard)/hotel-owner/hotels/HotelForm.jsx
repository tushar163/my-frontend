"use client";

import { Button, TextField, Label, Input, Description, TextArea, toast } from "@heroui/react";
import { useState } from "react";
import { createHotel, updateHotel } from "@/service/hotels";

export default function HotelForm({ method, setIsOpen, selectedRow, onSuccess }) {
    const isEdit = method === "Edit";

    const [form, setForm] = useState({
        name: selectedRow?.name || "",
        description: selectedRow?.description || "",
        address: selectedRow?.address || "",
        city: selectedRow?.city || "",
        state: selectedRow?.state || "",
        country: selectedRow?.country || "",
        latitude: selectedRow?.latitude ?? "",
        longitude: selectedRow?.longitude ?? "",
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
        if (!form.name.trim()) next.name = "Hotel name is required";
        if (!form.description.trim()) next.description = "Description is required";
        if (!form.address.trim()) next.address = "Address is required";
        if (!form.city.trim()) next.city = "City is required";
        if (!form.state.trim()) next.state = "State is required";
        if (!form.country.trim()) next.country = "Country is required";
        if (form.latitude !== "" && (Number(form.latitude) < -90 || Number(form.latitude) > 90))
            next.latitude = "Latitude must be between -90 and 90";
        if (form.longitude !== "" && (Number(form.longitude) < -180 || Number(form.longitude) > 180))
            next.longitude = "Longitude must be between -180 and 180";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            country: form.country.trim(),
            latitude: form.latitude !== "" ? Number(form.latitude) : undefined,
            longitude: form.longitude !== "" ? Number(form.longitude) : undefined,
            amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
            images: form.images.split(",").map((i) => i.trim()).filter(Boolean),
        };

        setIsSubmitting(true);
        try {
            if (isEdit) {
                await updateHotel(selectedRow.id, payload);
                toast.success("Hotel updated");
            } else {
                await createHotel(payload);
                toast.success("Hotel added");
            }
            onSuccess?.();
            setIsOpen(false);
        } catch (err) {
            toast.danger(err?.message || "Failed to save hotel");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField isRequired isInvalid={!!errors.name} className="w-full" name="name">
                <Label>Hotel Name</Label>
                <Input
                    placeholder="The Grand Palace"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
                {errors.name && <Description>{errors.name}</Description>}
            </TextField>

            <TextField isRequired isInvalid={!!errors.description} className="w-full" name="description">
                <Label>Description</Label>
                <TextArea
                    fullWidth
                    placeholder="A brief overview of the hotel, its style, and highlights"
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                />
                {errors.description && <Description>{errors.description}</Description>}
            </TextField>

            <TextField isRequired isInvalid={!!errors.address} className="w-full" name="address">
                <Label>Address</Label>
                <Input
                    placeholder="123 MG Road"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                />
                {errors.address && <Description>{errors.address}</Description>}
            </TextField>

            <div className="grid grid-cols-3 gap-4">
                <TextField isRequired isInvalid={!!errors.city} className="w-full" name="city">
                    <Label>City</Label>
                    <Input
                        placeholder="Mumbai"
                        value={form.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                    />
                    {errors.city && <Description>{errors.city}</Description>}
                </TextField>

                <TextField isRequired isInvalid={!!errors.state} className="w-full" name="state">
                    <Label>State</Label>
                    <Input
                        placeholder="Maharashtra"
                        value={form.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                    />
                    {errors.state && <Description>{errors.state}</Description>}
                </TextField>

                <TextField isRequired isInvalid={!!errors.country} className="w-full" name="country">
                    <Label>Country</Label>
                    <Input
                        placeholder="India"
                        value={form.country}
                        onChange={(e) => handleChange("country", e.target.value)}
                    />
                    {errors.country && <Description>{errors.country}</Description>}
                </TextField>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <TextField isInvalid={!!errors.latitude} className="w-full" name="latitude">
                    <Label>Latitude</Label>
                    <Input
                        type="number"
                        step="any"
                        placeholder="19.0760"
                        value={form.latitude}
                        onChange={(e) => handleChange("latitude", e.target.value)}
                    />
                    {errors.latitude ? (
                        <Description>{errors.latitude}</Description>
                    ) : (
                        <Description>Optional</Description>
                    )}
                </TextField>

                <TextField isInvalid={!!errors.longitude} className="w-full" name="longitude">
                    <Label>Longitude</Label>
                    <Input
                        type="number"
                        step="any"
                        placeholder="72.8777"
                        value={form.longitude}
                        onChange={(e) => handleChange("longitude", e.target.value)}
                    />
                    {errors.longitude ? (
                        <Description>{errors.longitude}</Description>
                    ) : (
                        <Description>Optional</Description>
                    )}
                </TextField>
            </div>

            <TextField className="w-full" name="amenities">
                <Label>Amenities</Label>
                <TextArea
                    fullWidth
                    placeholder="Pool, Spa, Free WiFi, Parking, Gym"
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
                    {isEdit ? "Save Changes" : "Add Hotel"}
                </Button>
            </div>
        </form>
    );
}