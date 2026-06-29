import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CELL_RENDERERS = {
  id: (user) => (
    <span className="font-mono text-sm text-muted-foreground">{user.id}</span>
  ),
  firstName: (user) => (
    <span className="font-medium text-foreground">{user.firstName}</span>
  ),
  lastName: (user) => (
    <span className="text-foreground">{user.lastName}</span>
  ),
  email: (user) => (
    <span className="text-muted-foreground">{user.email}</span>
  ),
  department: (user) => (
    <Badge variant="outline" className="bg-white font-normal text-muted-foreground">
      {user.department}
    </Badge>
  ),
  actions: (user, { onEdit, onDelete }) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(user)}
        className="h-8 w-8 text-muted-foreground hover:text-primary"
        data-testid={`button-edit-user-${user.id}`}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(user)}
        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        data-testid={`button-delete-user-${user.id}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export default function UserRow({ user, onEdit, onDelete, orderedColumns }) {
  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
      {orderedColumns.map((col) => (
        <td key={col.key} className="p-4 whitespace-nowrap">
          {CELL_RENDERERS[col.key]?.(user, { onEdit, onDelete }) ?? null}
        </td>
      ))}
    </tr>
  );
}
