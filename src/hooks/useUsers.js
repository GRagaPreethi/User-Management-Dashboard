import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchUsers, createUser, updateUser, deleteUser } from "../api/userService";
import { mapApiUsers, sortUsers, filterUsers, paginateUsers } from "../utils/helpers";
import { toast } from "sonner";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Table state
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Load from API / LocalStorage
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const storedUsers = localStorage.getItem("users");
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
          setLoading(false);
          return;
        }

        const res = await fetchUsers();
        const mapped = mapApiUsers(res.data);
        setUsers(mapped);
        localStorage.setItem("users", JSON.stringify(mapped));
      } catch (err) {
        setError(err.message || "Failed to load users");
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Sync users to localStorage on change
  useEffect(() => {
    if (!loading && users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users, loading]);

  const handleAddUser = async (userData) => {
    try {
      const res = await createUser(userData);
      const newId = Math.max(...users.map((u) => u.id), 0) + 1;
      const newUser = { ...userData, id: newId };
      setUsers([newUser, ...users]);
      toast.success("User added successfully");
    } catch (err) {
      toast.error("Failed to add user");
      throw err;
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      await updateUser(id, userData);
      setUsers(users.map((u) => (u.id === id ? { ...u, ...userData } : u)));
      toast.success("User updated successfully");
    } catch (err) {
      toast.error("Failed to update user");
      throw err;
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
      throw err;
    }
  };

  // Derived state
  const filteredUsers = useMemo(
    () => filterUsers(users, filters, search),
    [users, filters, search]
  );
  
  const sortedUsers = useMemo(
    () => sortUsers(filteredUsers, sortConfig.key, sortConfig.direction),
    [filteredUsers, sortConfig.key, sortConfig.direction]
  );

  const paginatedUsers = useMemo(
    () => paginateUsers(sortedUsers, page, pageSize),
    [sortedUsers, page, pageSize]
  );

  const totalPages = Math.ceil(sortedUsers.length / pageSize) || 1;

  // Reset page if out of bounds after filter
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  return {
    users,
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
    totalUsers: sortedUsers.length,
    totalPages,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
  };
};
