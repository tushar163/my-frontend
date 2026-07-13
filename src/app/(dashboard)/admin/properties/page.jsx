"use client";
import { Button, Label, ListBox, Select, toast } from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CustomTable } from "@/components/atoms/CustomTable";
import FormModal from "@/components/molecules/FormModal";
import useTableControls from "@/hooks/useTableControls";
import { deleteProperty, getProperties } from "@/service/properties";
import PropertyForm from "./PropertyForm";

const columns = [
  { id: "title", name: "Title", sortable: true },
  { id: "propertyType", name: "Property Type" },
  { id: "listingType", name: "Listing" },
  { id: "city", name: "City" },
  { id: "price", name: "Price" },
  { id: "status", name: "Status" },
  { id: "actions", name: "Actions" },
];

const ALL = "all";

const STATUS_OPTIONS = [
  { id: "ACTIVE", name: "Active" },
  { id: "PENDING_APPROVAL", name: "Pending Approval" },
  { id: "INACTIVE", name: "Inactive" },
  { id: "SOLD", name: "Sold" },
  { id: "RENTED", name: "Rented" },
];

// NOTE: adjust these to match your actual PropertyType enum values.
const PROPERTY_TYPE_OPTIONS = [
  { id: "HOUSE", name: "House" },
  { id: "APARTMENT", name: "Apartment" },
  { id: "VILLA", name: "Villa" },
  { id: "PLOT", name: "Plot" },
  { id: "COMMERCIAL", name: "Commercial" },
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [method, setMethod] = useState("Create");

  const [statusFilter, setStatusFilter] = useState/** @type {Key | null} */(ALL);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState/** @type {Key | null} */(ALL);
  const [cityFilter, setCityFilter] = useState("");

  const {
    page, pages, setPage,
    rowsPerPage, onRowsPerPageChange,
    totalItems,
    isOpen, setIsOpen,
    onRowSelected, selectedRowItem,
    filterValue, onSearchChange, onClear,
  } = useTableControls(properties, totalRecords);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getProperties({
        page,
        limit: rowsPerPage,
        search: filterValue || undefined,
        status: statusFilter !== ALL ? statusFilter : undefined,
        propertyType: propertyTypeFilter !== ALL ? propertyTypeFilter : undefined,
        city: cityFilter.trim() || undefined,
      });
      setProperties(result.data.properties || []);
      setTotalRecords(result.meta?.total ?? result.data.properties?.length ?? 0);
    } catch {
      toast.danger("Failed to fetch properties");
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, filterValue, statusFilter, propertyTypeFilter, cityFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset to page 1 whenever any filter changes.
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, propertyTypeFilter, cityFilter]);

  const handleDelete = async () => {
    if (!selectedRowItem) return;
    try {
      await deleteProperty(selectedRowItem.id);
      toast.success("Property removed");
      fetchData();
    } catch {
      toast.danger("Failed to delete property");
    }
  };

  const handleClearFilters = () => {
    setStatusFilter(ALL);
    setPropertyTypeFilter(ALL);
    setCityFilter("");
  };

  const hasActiveFilters =
    statusFilter !== ALL || propertyTypeFilter !== ALL || cityFilter.trim() !== "";

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
    if (columnKey === "status") {
      const statusColors = {
        ACTIVE: "text-success",
        PENDING_APPROVAL: "text-warning",
        INACTIVE: "text-danger",
        SOLD: "text-info",
        RENTED: "text-info",
      };
      return (
        <span className={`text-sm font-medium capitalize ${statusColors[item[columnKey]] || ""}`}>
          {item[columnKey]?.replace(/_/g, " ")}
        </span>
      );
    }
    if (columnKey === "price") {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(item[columnKey]);
    }
    if (columnKey === "listingType" || columnKey === "propertyType") {
      return <span className="text-sm capitalize">{item[columnKey]?.toLowerCase()}</span>;
    }
    return item[columnKey];
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-display font-semibold text-ink">Properties</h1>
        <div className="flex flex-wrap items-center gap-3">
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
            onPress={() => { setMethod("Create"); setIsOpen(true); }}
            className="bg-brand-navy text-ink-inverse"
          >
            Add Property
          </Button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-end gap-3">
        <Select
          className="w-48"
          placeholder="All Statuses"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
        >
          <Label>Status</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item key={ALL} id={ALL} textValue="All Statuses">
                All Statuses
                <ListBox.ItemIndicator />
              </ListBox.Item>
              {STATUS_OPTIONS.map((opt) => (
                <ListBox.Item key={opt.id} id={opt.id} textValue={opt.name}>
                  {opt.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          className="w-48"
          placeholder="All Types"
          value={propertyTypeFilter}
          onChange={(value) => setPropertyTypeFilter(value)}
        >
          <Label>Property Type</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item key={ALL} id={ALL} textValue="All Types">
                All Types
                <ListBox.ItemIndicator />
              </ListBox.Item>
              {PROPERTY_TYPE_OPTIONS.map((opt) => (
                <ListBox.Item key={opt.id} id={opt.id} textValue={opt.name}>
                  {opt.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-ink-secondary">City</span>
          <input
            className="rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm text-ink placeholder:text-ink-secondary outline-none w-40"
            placeholder="e.g. Mumbai"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-ink-secondary hover:text-ink pb-2"
          >
            Clear filters
          </button>
        )}
      </div>

      <CustomTable
        columns={columns}
        items={properties}
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
        <FormModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title={method === "Create" ? "Add Property" : "Edit Property"}
        >
          <PropertyForm
            method={method}
            setIsOpen={setIsOpen}
            selectedRow={selectedRowItem}
            onSuccess={fetchData}
          />
        </FormModal>
      )}
    </div>
  );
}