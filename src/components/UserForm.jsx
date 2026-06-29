import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEPARTMENTS } from "../utils/constants";
import { validateUser } from "../utils/validators";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserForm({ open, onOpenChange, initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [errors, setErrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!initialData;

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          department: "",
        });
      }
      setErrors(null);
    }
  }, [open, initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateUser(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName" className={errors?.firstName ? "text-destructive" : ""}>
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={errors?.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                data-testid="input-firstname"
              />
              {errors?.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="lastName" className={errors?.lastName ? "text-destructive" : ""}>
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={errors?.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
                data-testid="input-lastname"
              />
              {errors?.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className={errors?.email ? "text-destructive" : ""}>
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors?.email ? "border-destructive focus-visible:ring-destructive" : ""}
                data-testid="input-email"
              />
              {errors?.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department" className={errors?.department ? "text-destructive" : ""}>
                Department
              </Label>
              <Select
                value={formData.department}
                onValueChange={(val) => handleChange("department", val)}
              >
                <SelectTrigger 
                  className={errors?.department ? "border-destructive focus-visible:ring-destructive" : ""}
                  data-testid="select-department"
                >
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.department && <p className="text-xs text-destructive">{errors.department}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-form">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} data-testid="button-submit-form">
              {isSubmitting ? "Saving..." : "Save User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
