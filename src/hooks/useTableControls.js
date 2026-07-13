"use client";

import { useMemo, useState } from "react";

export default function useTableControls(data, totalRecords) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedRowItem, setSelectedRowItem] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const pages = useMemo(
    () => Math.ceil(totalRecords / rowsPerPage) || 1,
    [totalRecords, rowsPerPage]
  );

  const onRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const onSearchChange = (value) => {
    setFilterValue(value);
    setPage(1);
  };

  const onClear = () => {
    setFilterValue("");
    setPage(1);
  };

  const onRowSelected = (item) => {
    setSelectedRowItem(item);
  };

  return {
    page,
    pages,
    setPage,
    rowsPerPage,
    onRowsPerPageChange,
    totalItems: totalRecords,
    onClear,
    isOpen,
    setIsOpen,
    onRowSelected,
    selectedRowItem,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    recordToDelete,
    setRecordToDelete,
    filterValue,
    onSearchChange,
  };
}
