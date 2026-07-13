"use client";

import { Button, toast } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { CustomTable } from "@/components/atoms/CustomTable";
import useTableControls from "@/hooks/useTableControls";
import { getAllUsers, toggleUserStatus } from "@/service/admin";

const columns = [
  { id: "name", name: "Name", sortable: true },
  { id: "email", name: "Email" },
  { id: "role", name: "Role" },
  { id: "isActive", name: "Status" },
  { id: "actions", name: "Actions" },
];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {
    page, pages, setPage,
    rowsPerPage, onRowsPerPageChange,
    totalItems,
    filterValue, onSearchChange, onClear,
  } = useTableControls(users, totalRecords);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAllUsers({
        page,
        limit: rowsPerPage,
        search: filterValue || undefined,
      });
      setUsers(result.data.users || []);
      setTotalRecords(result.meta?.total ?? result.data.users?.length ?? 0);
    } catch {
      toast.danger("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, filterValue]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggleStatus = async (user) => {
    try {
      await toggleUserStatus(user.id);
      toast.success(`User ${user.name} status toggled`);
      fetchData();
    } catch {
      toast.danger("Failed to toggle status");
    }
  };

  const renderCell = useCallback((item, columnKey) => {
    if (columnKey === "actions") {
      return (
        <Button size="sm" variant="tertiary" onPress={() => handleToggleStatus(item)}>
          {item.isActive ? "Deactivate" : "Activate"}
        </Button>
      );
    }
    if (columnKey === "isActive") {
      return (
        <span className={`text-sm font-medium capitalize ${item[columnKey] ? "text-success" : "text-danger"}`}>
          {item[columnKey] ? "Active" : "Inactive"}
        </span>
      );
    }
    if (columnKey === "role") {
      return (
        <span className="text-sm capitalize">{item[columnKey]?.toLowerCase()}</span>
      );
    }
    return item[columnKey];
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-display font-semibold text-ink">Users</h1>
        <div className="flex items-center gap-3">
          <input
            className="rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm text-ink placeholder:text-ink-secondary outline-none"
            placeholder="Search users..."
            value={filterValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {filterValue && (
            <button onClick={onClear} className="text-sm text-ink-secondary hover:text-ink">
              Clear
            </button>
          )}
        </div>
      </div>

      <CustomTable
        columns={columns}
        items={users}
        page={page}
        pages={pages}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        totalItems={totalItems}
        isLoading={isLoading}
        renderCell={renderCell}
      />
    </div>
  );
}
