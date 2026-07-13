"use client";

import { Button, FieldError, Label, ListBox, Select, toast } from "@heroui/react";
import { useState } from "react";
import { updateBookingStatus } from "@/service/bookings";

const STATUS_OPTIONS = [
  { id: "confirmed", name: "Confirmed" },
  { id: "checked_in", name: "Checked In" },
  { id: "checked_out", name: "Checked Out" },
  { id: "cancelled", name: "Cancelled" },
];

export default function BookingStatusForm({ setIsOpen, selectedRow, onSuccess }) {
  const [status, setStatus] = useState(selectedRow?.status || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!status) { setError("Status is required"); return; }
    setError("");

    setSubmitting(true);
    try {
      await updateBookingStatus(selectedRow.id, status);
      onSuccess();
      setIsOpen(false);
    } catch (err) {
      toast.danger(err.message || "Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select
        isRequired
        isInvalid={!!error}
        placeholder="Select status"
        value={status}
        onChange={(key) => { setStatus(key); setError(""); }}
      >
        <Label>Booking Status</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {STATUS_OPTIONS.map((opt) => (
              <ListBox.Item key={opt.id} id={opt.id} textValue={opt.name}>
                {opt.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
        {error && <FieldError>{error}</FieldError>}
      </Select>

      <div className="flex justify-end gap-2">
        <Button variant="tertiary" onPress={() => setIsOpen(false)}>Cancel</Button>
        <Button type="submit" isDisabled={submitting} color="primary">
          {submitting ? "Updating..." : "Update Status"}
        </Button>
      </div>
    </form>
  );
}
