function escapeField(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCSV(users, columns) {
  const header = columns.map((c) => c.label).join(",");
  const rows = users.map((user) =>
    columns.map((c) => escapeField(user[c.key])).join(",")
  );
  return [header, ...rows].join("\n");
}

function getFileName() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `users-${yyyy}-${mm}-${dd}.csv`;
}

export function exportToCSV(users, columns) {
  if (!users || users.length === 0) return false;
  const csv = buildCSV(users, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", getFileName());
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
