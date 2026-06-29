export const ALL_COLUMNS = [
  { key: "id", label: "ID", exportable: true, sortable: true },
  { key: "firstName", label: "First Name", exportable: true, sortable: true },
  { key: "lastName", label: "Last Name", exportable: true, sortable: true },
  { key: "email", label: "Email", exportable: true, sortable: true },
  { key: "department", label: "Department", exportable: true, sortable: true },
  { key: "actions", label: "Actions", exportable: false, sortable: false },
];

const STORAGE_KEY = "visibleColumns";
const DEFAULT_KEYS = ALL_COLUMNS.map((c) => c.key);

export function getVisibleColumns() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const valid = parsed.filter((k) => ALL_COLUMNS.some((c) => c.key === k));
      if (valid.length > 0) return valid;
    }
  } catch {
    // ignore
  }
  return DEFAULT_KEYS;
}

export function saveVisibleColumns(keys) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function getExportableColumns(visibleKeys) {
  return ALL_COLUMNS.filter(
    (c) => c.exportable && visibleKeys.includes(c.key)
  );
}
