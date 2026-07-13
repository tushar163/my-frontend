"use client";

import { Pagination, Spinner, Table } from "@heroui/react";
import { useMemo } from "react";

export function CustomTable({
  columns,
  items,
  page,
  pages,
  setPage,
  rowsPerPage,
  onRowsPerPageChange,
  totalItems,
  selectedKeys,
  selectionMode,
  sortDescriptor,
  onSelectionChange,
  onSortChange,
  isLoading,
  renderCell,
}) {
  const footer = useMemo(() => {
    if (!totalItems) return null;

    const start = (page - 1) * rowsPerPage + 1;
    const end = Math.min(page * rowsPerPage, totalItems);

    return (
      <Table.Footer>
        <div className="flex items-center justify-between w-full">
          <Pagination size="sm">
            <Pagination.Summary>
              {start} to {end} of {totalItems} results
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={page === 1}
                  onPress={() => setPage(Math.max(1, page - 1))}
                >
                  <Pagination.PreviousIcon />
                  Prev
                </Pagination.Previous>
              </Pagination.Item>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Pagination.Item key={p}>
                  <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Next
                  isDisabled={page === pages}
                  onPress={() => setPage(Math.min(pages, page + 1))}
                >
                  Next
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>

          {onRowsPerPageChange && (
            <label className="flex items-center gap-2 text-sm text-muted">
              Rows per page:
              <select
                className="bg-transparent outline-none text-sm"
                onChange={onRowsPerPageChange}
                defaultValue={rowsPerPage || 10}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </label>
          )}
        </div>
      </Table.Footer>
    );
  }, [page, pages, rowsPerPage, totalItems, setPage, onRowsPerPageChange]);

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Data table"
          selectedKeys={selectedKeys}
          selectionMode={selectionMode}
          sortDescriptor={sortDescriptor}
          onSelectionChange={onSelectionChange}
          onSortChange={onSortChange}
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column
                key={column.id}
                allowsSorting={column.sortable}
                isRowHeader={column.isRowHeader}
              >
                {column.name}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body
            items={items}
            loadingContent={<Spinner color="primary" />}
            isLoading={isLoading}
          >
            {(item) => (
              <Table.Row key={item.id}>
                <Table.Collection items={columns}>
                  {(column) => (
                    <Table.Cell className="max-w-64 text-ellipsis whitespace-nowrap overflow-hidden">
                      {renderCell
                        ? renderCell(item, column.id)
                        : item[column.id]
                      }
                    </Table.Cell>
                  )}
                </Table.Collection>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      {totalItems > 0 && footer}
    </Table>
  );
}
