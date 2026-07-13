"use client";

import { Button, toast } from "@heroui/react";
import { Edit, Plus, Trash2, BedDouble } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CustomTable } from "@/components/atoms/CustomTable";
import FormModal from "@/components/molecules/FormModal";
import useTableControls from "@/hooks/useTableControls";
import { getHotels, getRooms, deleteRoom } from "@/service/hotels";
import RoomForm from "../../admin/hotels/rooms/RoomForm";

const columns = [
  { id: "roomType", name: "Room Type", sortable: true },
  { id: "pricePerNight", name: "Price / Night" },
  { id: "capacity", name: "Capacity" },
  { id: "totalRooms", name: "Total Rooms" },
  { id: "actions", name: "Actions" },
];

export default function OwnerRooms() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [method, setMethod] = useState("Create");

  const {
    page, pages, setPage,
    rowsPerPage, onRowsPerPageChange,
    totalItems,
    isOpen, setIsOpen,
    onRowSelected, selectedRowItem,
    filterValue, onSearchChange, onClear,
  } = useTableControls(rooms, totalRecords);

  // Load the owner's hotels once, to populate the selector
  useEffect(() => {
    (async () => {
      try {
        const result = await getHotels({ limit: 100 });
        const list = result.data?.hotels || result.hotels || [];
        setHotels(list);
        if (list.length > 0) setSelectedHotelId(list[0].id);
      } catch {
        toast.danger("Failed to fetch hotels");
      }
    })();
  }, []);

  const fetchRooms = useCallback(async () => {
    if (!selectedHotelId) {
      setRooms([]);
      setTotalRecords(0);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const result = await getRooms(selectedHotelId, {
        page,
        limit: rowsPerPage,
        search: filterValue || undefined,
      });
      setRooms(result.data?.rooms || result.rooms || []);
      setTotalRecords(result.meta?.total ?? result.data?.rooms?.length ?? 0);
    } catch {
      toast.danger("Failed to fetch rooms");
    } finally {
      setIsLoading(false);
    }
  }, [selectedHotelId, page, rowsPerPage, filterValue]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleDelete = async () => {
    if (!selectedRowItem) return;
    try {
      await deleteRoom(selectedRowItem.id);
      toast.success("Room removed");
      fetchRooms();
    } catch {
      toast.danger("Failed to delete room");
    }
  };

  const renderCell = useCallback((item, columnKey) => {
    if (columnKey === "actions") {
      return (
        <div className="flex items-center gap-1">
          <Button isIconOnly size="sm" variant="tertiary"
            onPress={() => { setMethod("Edit"); onRowSelected(item); setIsOpen(true); }}>
            <Edit className="size-4" />
          </Button>
          <Button isIconOnly size="sm" variant="danger-soft"
            onPress={() => { onRowSelected(item); handleDelete(); }}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      );
    }
    if (columnKey === "pricePerNight") {
      return `₹${item.pricePerNight?.toLocaleString?.() ?? item.pricePerNight}`;
    }
    return item[columnKey];
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-display font-semibold text-ink">Room Inventory</h1>
        <p className="mt-2 text-ink-secondary">Manage rooms across your hotels.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <select
          className="rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm text-ink outline-none"
          value={selectedHotelId}
          onChange={(e) => { setSelectedHotelId(e.target.value); setPage(1); }}
        >
          {hotels.length === 0 && <option value="">No hotels found</option>}
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-3">
          <input
            className="rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm text-ink placeholder:text-ink-secondary outline-none"
            placeholder="Search rooms..."
            value={filterValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {filterValue && (
            <button onClick={onClear} className="text-sm text-ink-secondary hover:text-ink">
              Clear
            </button>
          )}
          <Button
            isDisabled={!selectedHotelId}
            onPress={() => { setMethod("Create"); onRowSelected(null); setIsOpen(true); }}
            className="bg-brand-navy text-ink-inverse"
          >
            <Plus className="size-4" /> Add Room
          </Button>
        </div>
      </div>

      <CustomTable
        columns={columns}
        items={rooms}
        page={page}
        pages={pages}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        totalItems={totalItems}
        isLoading={isLoading}
        renderCell={renderCell}
        emptyContent={
          <div className="flex flex-col items-center gap-2 py-8 text-ink-secondary">
            <BedDouble className="size-6" />
            <span>No rooms yet for this hotel.</span>
          </div>
        }
      />

      {isOpen && (
        <FormModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title={`${method === "Create" ? "Add" : "Edit"} Room`}
        >
          <RoomForm
            method={method}
            setIsOpen={setIsOpen}
            selectedRow={selectedRowItem}
            hotelId={selectedHotelId}
            onSuccess={fetchRooms}
          />
        </FormModal>
      )}
    </div>
  );
}