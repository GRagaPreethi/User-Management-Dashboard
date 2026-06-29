import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEPARTMENTS } from "../utils/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterPopup({ filters, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [open, setOpen] = useState(false);

  // Sync local state with prop whenever the dialog opens
  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open]);

  const handleApply = () => {
    onFilterChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const emptyFilters = { firstName: "", lastName: "", email: "", department: "" };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
    setOpen(false);
  };

  const activeCount = Object.values(filters).filter((v) => v).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white" data-testid="button-open-filters">
          <Filter className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Users</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filter-firstName" className="text-right">
              First Name
            </Label>
            <Input
              id="filter-firstName"
              value={localFilters.firstName}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, firstName: e.target.value })
              }
              className="col-span-3"
              data-testid="input-filter-firstname"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filter-lastName" className="text-right">
              Last Name
            </Label>
            <Input
              id="filter-lastName"
              value={localFilters.lastName}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, lastName: e.target.value })
              }
              className="col-span-3"
              data-testid="input-filter-lastname"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filter-email" className="text-right">
              Email
            </Label>
            <Input
              id="filter-email"
              value={localFilters.email}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, email: e.target.value })
              }
              className="col-span-3"
              data-testid="input-filter-email"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filter-department" className="text-right">
              Department
            </Label>
            <div className="col-span-3">
              <Select
                value={localFilters.department}
                onValueChange={(val) =>
                  setLocalFilters({
                    ...localFilters,
                    department: val === "all" ? "" : val,
                  })
                }
              >
                <SelectTrigger data-testid="select-filter-department">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:space-x-0">
          <Button
            variant="outline"
            onClick={handleReset}
            data-testid="button-reset-filters"
          >
            Reset
          </Button>
          <Button onClick={handleApply} data-testid="button-apply-filters">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
