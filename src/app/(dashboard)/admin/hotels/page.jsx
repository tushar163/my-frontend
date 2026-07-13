"use client";

import { Button, toast } from "@heroui/react";
import { Edit, Hotel, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CustomTable } from "@/components/atoms/CustomTable";
import FormModal from "@/components/molecules/FormModal";
import useTableControls from "@/hooks/useTableControls";
import { deleteHotel, deleteRoom } from "@/service/hotels";
import { getAllHotelsAdmin, toggleHotelStatus } from "@/service/admin";
import HotelForm from "./HotelForm";
import RoomForm from "./rooms/RoomForm";

const columns = [
  { id: "name", name: "Hotel Name", sortable: true },
  { id: "city", name: "City" },
  { id: "isActive", name: "Status" },
  { id: "actions", name: "Actions" },
];

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [method, setMethod] = useState("Create");
  const [modalType, setModalType] = useState("hotel");
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  const {
    page, pages, setPage,
    rowsPerPage, onRowsPerPageChange,
    totalItems,
    isOpen, setIsOpen,
    onRowSelected, selectedRowItem,
    filterValue, onSearchChange, onClear,
  } = useTableControls(hotels, totalRecords);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAllHotelsAdmin({
        page,
        limit: rowsPerPage,
        search: filterValue || undefined,
      });
      setHotels(result.data?.hotels || result.hotels || []);
      setTotalRecords(result.meta?.total ?? result.data?.hotels?.length ?? 0);
    } catch {
      toast.danger("Failed to fetch hotels");
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, filterValue]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!selectedRowItem) return;
    try {
      await deleteHotel(selectedRowItem.id);
      toast.success("Hotel removed");
      fetchData();
    } catch {
      toast.danger("Failed to delete hotel");
    }
  };

  const handleToggleStatus = async (hotel) => {
    try {
      await toggleHotelStatus(hotel.id);
      toast.success(`Hotel ${hotel.isActive ? "deactivated" : "activated"}`);
      fetchData();
    } catch {
      toast.danger("Failed to toggle hotel status");
    }
  };

  const renderCell = useCallback((item, columnKey) => {
    if (columnKey === "actions") {
      return (
        <div className="flex items-center gap-1">
          <Button isIconOnly size="sm" variant="tertiary"
            onPress={() => handleToggleStatus(item)}>
            {item.isActive ? <ToggleRight className="size-4 text-success" /> : <ToggleLeft className="size-4 text-warning" />}
          </Button>
          <Button isIconOnly size="sm" variant="tertiary"
            onPress={() => { setModalType("room"); setSelectedHotelId(item.id); setMethod("Create"); setIsOpen(true); }}>
            <Plus className="size-4" />
          </Button>
          <Button isIconOnly size="sm" variant="tertiary"
            onPress={() => { setModalType("hotel"); setMethod("Edit"); onRowSelected(item); setIsOpen(true); }}>
            <Edit className="size-4" />
          </Button>
          <Button isIconOnly size="sm" variant="danger-soft"
            onPress={() => { onRowSelected(item); handleDelete(); }}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      );
    }
    if (columnKey === "isActive") {
      return (
        <span className={`text-sm font-medium capitalize ${item.isActive ? "text-success" : "text-warning"}`}>
          {item.isActive ? "Active" : "Inactive"}
        </span>
      );
    }
    return item[columnKey];
  }, []);

  const modalTitle = modalType === "hotel"
    ? `${method === "Create" ? "Add" : "Edit"} Hotel`
    : `Add Room${selectedRowItem ? ` to ${selectedRowItem.name}` : ""}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-display font-semibold text-ink">Hotels</h1>
        <div className="flex items-center gap-3">
          <input
            className="rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm text-ink placeholder:text-ink-secondary outline-none"
            placeholder="Search..."
            value={filterValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {filterValue && (
            <button onClick={onClear} className="text-sm text-ink-secondary hover:text-ink">
              Clear
            </button>
          )}
          <Button
            onPress={() => { setModalType("hotel"); setMethod("Create"); setIsOpen(true); }}
            className="bg-brand-navy text-ink-inverse"
          >
            <Hotel className="size-4" /> Add Hotel
          </Button>
        </div>
      </div>

      <CustomTable
        columns={columns}
        items={hotels}
        page={page}
        pages={pages}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        totalItems={totalItems}
        isLoading={isLoading}
        renderCell={renderCell}
      />

      {isOpen && (
        <FormModal isOpen={isOpen} setIsOpen={setIsOpen} title={modalTitle}>
          {modalType === "hotel" ? (
            <HotelForm
              method={method}
              setIsOpen={setIsOpen}
              selectedRow={selectedRowItem}
              onSuccess={fetchData}
            />
          ) : (
            <RoomForm
              method={method}
              setIsOpen={setIsOpen}
              selectedRow={selectedRowItem}
              hotelId={selectedHotelId}
              onSuccess={fetchData}
            />
          )}
        </FormModal>
      )}
    </div>
  );
}
