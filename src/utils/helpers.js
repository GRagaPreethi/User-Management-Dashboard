import { DEPARTMENTS } from "./constants";

export const generateDepartment = (id) => {
  return DEPARTMENTS[(id - 1) % 6];
};

export const mapApiUsers = (apiUsers) => {
  return apiUsers.map((u) => {
    const parts = u.name.split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");
    return {
      id: u.id,
      firstName,
      lastName,
      email: u.email,
      department: generateDepartment(u.id),
    };
  });
};

export const sortUsers = (users, key, direction) => {
  if (!key) return users;
  return [...users].sort((a, b) => {
    const aVal = a[key] ? String(a[key]).toLowerCase() : "";
    const bVal = b[key] ? String(b[key]).toLowerCase() : "";
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

export const filterUsers = (users, filters, search) => {
  return users.filter((u) => {
    // Check filters
    if (
      filters.firstName &&
      !u.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
    )
      return false;
    if (
      filters.lastName &&
      !u.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
    )
      return false;
    if (
      filters.email &&
      !u.email.toLowerCase().includes(filters.email.toLowerCase())
    )
      return false;
    if (filters.department && u.department !== filters.department) return false;

    // Check search (across all fields)
    if (search) {
      const searchLower = search.toLowerCase();
      const matchSearch =
        u.firstName.toLowerCase().includes(searchLower) ||
        u.lastName.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.department.toLowerCase().includes(searchLower);
      if (!matchSearch) return false;
    }

    return true;
  });
};

export const paginateUsers = (users, page, pageSize) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return users.slice(start, end);
};
