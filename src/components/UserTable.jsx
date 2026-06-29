import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import UserRow from "./UserRow";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserTable({
  users,
  loading,
  sortConfig,
  onSort,
  onEditUser,
  onDeleteUser,
  pageSize,
  orderedColumns = [],
}) {
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column)
      return <ChevronsUpDown className="ml-1 h-3 w-3 text-muted-foreground/50" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="ml-1 h-3 w-3 text-primary" />
    ) : (
      <ChevronDown className="ml-1 h-3 w-3 text-primary" />
    );
  };

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border uppercase text-xs tracking-wider">
            <tr>
              {orderedColumns.map((col) => (
                <th
                  key={col.key}
                  className={`p-4 font-medium whitespace-nowrap ${
                    col.sortable
                      ? "cursor-pointer select-none hover:bg-muted/70 transition-colors"
                      : ""
                  }`}
                  onClick={() => col.sortable && onSort(col.key)}
                  data-testid={`header-sort-${col.key}`}
                >
                  <div className="flex items-center">
                    {col.label}
                    {col.sortable && <SortIcon column={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, idx) => (
                <tr key={idx} className="border-b border-border">
                  {orderedColumns.map((col) => (
                    <td key={col.key} className="p-4">
                      <Skeleton className="h-5 w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={orderedColumns.length}
                  className="p-12 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-medium text-foreground">
                      No users found.
                    </p>
                    <p className="text-sm mt-1">
                      Try adjusting your filters or search query.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onEdit={onEditUser}
                  onDelete={onDeleteUser}
                  orderedColumns={orderedColumns}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
