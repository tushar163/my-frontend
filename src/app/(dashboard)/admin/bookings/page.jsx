"use client";
import { Label, ListBox, Select, toast } from "@heroui/react";
import { Edit, Eye } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CustomTable } from "@/components/atoms/CustomTable";
import FormModal from "@/components/molecules/FormModal";
import useTableControls from "@/hooks/useTableControls";
import { cancelBooking, getHotelBookings } from "@/service/bookings";

import BookingStatusForm from "./BookingStatusForm";
import { getHotels } from "@/service/hotels";

const columns = [
  { id: "id", name: "Booking ID", sortable: true },
  { id: "user", name: "Guest" },
  { id: "hotel", name: "Hotel" },
  { id: "checkIn", name: "Check In" },
  { id: "checkOut", name: "Check Out" },
  { id: "totalPrice", name: "Total" },
  { id: "status", name: "Status" },
  { id: "actions", name: "Actions" },
];

const ALL_HOTELS_ID = "all";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [hotels, setHotels] = useState([]);
  const [isHotelsLoading, setIsHotelsLoading] = useState(true);

  // Controlled Select state — Key | null, per HeroUI v3 pattern.
  const [selectedHotelKey, setSelectedHotelKey] = useState/** @type {Key | null} */(ALL_HOTELS_ID);

  const {
    page, pages, setPage,
    rowsPerPage, onRowsPerPageChange,
    totalItems,
  } = useTableControls(bookings, totalRecords);

  // Load the hotel list once, for the select dropdown.
  useEffect(() => {
    const fetchHotels = async () => {
      setIsHotelsLoading(true);
      try {
        const result = await getHotels();
        setHotels(result.data.hotels || []);
      } catch {
        toast.danger("Failed to fetch hotels");
      } finally {
        setIsHotelsLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const selectedHotelId = selectedHotelKey === ALL_HOTELS_ID ? "" : selectedHotelKey;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getHotelBookings(selectedHotelId);
      setBookings(result.data.bookings || []);
      setTotalRecords(result.data.bookings?.length ?? 0);
    } catch {
      toast.danger("Failed to fetch bookings");
    } finally {
      setIsLoading(false);
    }
  }, [selectedHotelId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset to page 1 whenever the hotel filter changes.
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHotelId]);

  const handleCancel = async (booking) => {
    try {
      await cancelBooking(booking.id);
      toast.success("Booking cancelled");
      fetchData();
    } catch {
      toast.danger("Failed to cancel booking");
    }
  };

  const renderCell = useCallback((item, columnKey) => {
    if (columnKey === "actions") {
      return (
        <div className="flex items-center gap-1">
          <button
            className="p-1 text-ink-secondary hover:text-ink transition-colors"
            onClick={() => { setSelectedRow(item); setIsOpen(true); }}
            title="Update status"
          >
            <Edit className="size-4" />
          </button>
          {item.status !== "CANCELLED" && item.status !== "COMPLETED" && (
            <button
              className="p-1 text-danger hover:text-danger transition-colors"
              onClick={() => handleCancel(item)}
              title="Cancel booking"
            >
              <Eye className="size-4" />
            </button>
          )}
        </div>
      );
    }
    if (columnKey === "status") {
      const colors = {
        PENDING: "text-warning",
        CONFIRMED: "text-info",
        CANCELLED: "text-danger",
        COMPLETED: "text-success",
      };
      return (
        <span className={`text-sm font-medium capitalize ${colors[item[columnKey]] || ""}`}>
          {item[columnKey]?.toLowerCase()}
        </span>
      );
    }
    if (columnKey === "checkIn" || columnKey === "checkOut") {
      return item[columnKey] ? new Date(item[columnKey]).toLocaleDateString() : "—";
    }
    if (columnKey === "totalPrice") {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(item[columnKey]);
    }
    if (columnKey === "user") {
      return item[columnKey]?.name || "—";
    }
    if (columnKey === "hotel") {
      return item[columnKey]?.name || "—";
    }
    return item[columnKey];
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-display font-semibold text-ink">Bookings</h1>

        <Select
          className="w-64"
          placeholder="Select a hotel"
          value={selectedHotelKey}
          onChange={(value) => setSelectedHotelKey(value)}
        >
          <Label>Hotel</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item key={ALL_HOTELS_ID} id={ALL_HOTELS_ID} textValue="All Hotels">
                All Hotels
                <ListBox.ItemIndicator />
              </ListBox.Item>
              {!isHotelsLoading &&
                hotels.map((hotel) => (
                  <ListBox.Item key={hotel.id} id={hotel.id} textValue={hotel.name}>
                    {hotel.name}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <CustomTable
        columns={columns}
        items={bookings}
        page={page}
        pages={pages}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        totalItems={totalItems}
        isLoading={isLoading}
        renderCell={renderCell}
      />

      {isOpen && selectedRow && (
        <FormModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Update Booking Status"
        >
          <BookingStatusForm
            setIsOpen={setIsOpen}
            selectedRow={selectedRow}
            onSuccess={fetchData}
          />
        </FormModal>
      )}
    </div>
  );
}