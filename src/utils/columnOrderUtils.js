import { ALL_COLUMNS } from "./columnUtils";

const ORDER_KEY = "columnOrder";
const DEFAULT_ORDER = ALL_COLUMNS.map((c) => c.key);

export function getColumnOrder() {
  try {
    const stored = localStorage.getItem(ORDER_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const allKeys = ALL_COLUMNS.map((c) => c.key);
      // Keep only valid keys, then append any new columns not in stored order
      const valid = parsed.filter((k) => allKeys.includes(k));
      const missing = allKeys.filter((k) => !valid.includes(k));
      return [...valid, ...missing];
    }
  } catch {
    // ignore
  }
  return DEFAULT_ORDER;
}

export function saveColumnOrder(order) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

/**
 * Given an order (all keys) and visible keys, return the ordered
 * list of visible column objects (for table rendering).
 */
export function getOrderedVisibleColumns(columnOrder, visibleKeys) {
  return columnOrder
    .filter((k) => visibleKeys.includes(k))
    .map((k) => ALL_COLUMNS.find((c) => c.key === k))
    .filter(Boolean);
}

/**
 * Given ordered column objects, return only the exportable ones.
 */
export function getOrderedExportableColumns(orderedVisibleCols) {
  return orderedVisibleCols.filter((c) => c.exportable);
}
