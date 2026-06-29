import { useState } from "react";
import { Plus, Download } from "lucide-react";
import { Toaster, toast } from "sonner";
import { exportToCSV } from "./utils/exportCSV";
import { getVisibleColumns, saveVisibleColumns } from "./utils/columnUtils";
import {
  getColumnOrder,
  saveColumnOrder,
  getOrderedVisibleColumns,
  getOrderedExportableColumns,
} from "./utils/columnOrderUtils";
import { Button } from "@/components/ui/button";
import { useUsers } from "./hooks/useUsers";

import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import SearchBar from "./components/SearchBar";
import FilterPopup from "./components/FilterPopup";
import ColumnManager from "./components/ColumnManager";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import UserForm from "./components/UserForm";
import ConfirmDelete from "./components/ConfirmDelete";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const {
    loading,
    error,
    search,
    setSearch,
    filters,
    setFilters,
    sortConfig,
    setSortConfig,
    page,
    setPage,
    pageSize,
    setPageSize,
    paginatedUsers,
    totalUsers,
    totalPages,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
  } = useUsers();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState(() => getVisibleColumns());
  const [columnOrder, setColumnOrder] = useState(() => getColumnOrder());

  // Ordered list of visible column definitions — single source of truth for table & CSV
  const orderedColumns = getOrderedVisibleColumns(columnOrder, visibleColumns);

  const handleColumnChange = ({ visibleColumns: newVisible, columnOrder: newOrder }) => {
    setVisibleColumns(newVisible);
    saveVisibleColumns(newVisible);
    setColumnOrder(newOrder);
    saveColumnOrder(newOrder);
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setFormOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleExportCSV = () => {
    const exportColumns = getOrderedExportableColumns(orderedColumns);
    const success = exportToCSV(paginatedUsers, exportColumns);
    if (!success) {
      toast.error("No users available to export.");
    }
  };

  const handleFormSubmit = async (data) => {
    if (selectedUser) {
      await handleUpdateUser(selectedUser.id, data);
    } else {
      await handleAddUser(data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Toaster position="top-right" richColors />
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <ErrorMessage message={error} />

        <StatsCards
          totalUsers={totalUsers}
          uniqueDepartments={new Set(paginatedUsers.map((u) => u.department)).size}
          currentPageUsers={paginatedUsers.length}
        />

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex w-full sm:w-auto items-center gap-3">
            <SearchBar onSearch={setSearch} />
            <FilterPopup filters={filters} onFilterChange={setFilters} />
          </div>
          <div className="flex w-full sm:w-auto items-center gap-3">
            <ColumnManager
              visibleColumns={visibleColumns}
              columnOrder={columnOrder}
              onChange={handleColumnChange}
            />
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="gap-2"
              data-testid="button-export-csv"
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button
              onClick={openAddModal}
              className="gap-2"
              data-testid="button-add-user"
            >
              <Plus className="h-4 w-4" /> Add User
            </Button>
          </div>
        </div>

        <UserTable
          users={paginatedUsers}
          loading={loading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEditUser={openEditModal}
          onDeleteUser={openDeleteModal}
          pageSize={pageSize}
          orderedColumns={orderedColumns}
        />

        <Pagination
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          totalItems={totalUsers}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </main>

      <UserForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={selectedUser}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={selectedUser}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}

export default App;
