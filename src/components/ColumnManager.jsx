import { useState, useRef, useEffect } from "react";
import { Columns, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALL_COLUMNS } from "../utils/columnUtils";

export default function ColumnManager({ visibleColumns, columnOrder, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const dragKey = useRef(null);
  const dragOverKey = useRef(null);

  // ordered list of ALL column definitions (visible + hidden)
  const orderedDefs = columnOrder
    .map((k) => ALL_COLUMNS.find((c) => c.key === k))
    .filter(Boolean);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    const onClickOut = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOut);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOut);
    };
  }, [open]);

  const toggleVisibility = (key) => {
    const isVisible = visibleColumns.includes(key);
    if (isVisible && visibleColumns.length === 1) return; // must keep at least one
    const next = isVisible
      ? visibleColumns.filter((k) => k !== key)
      : [...visibleColumns, key];
    onChange({ visibleColumns: next, columnOrder });
  };

  // --- Drag handlers ---
  const handleDragStart = (e, key) => {
    dragKey.current = key;
    e.dataTransfer.effectAllowed = "move";
    // slight delay so the ghost image looks normal
    requestAnimationFrame(() => {
      if (e.target) e.target.style.opacity = "0.4";
    });
  };

  const handleDragEnd = (e) => {
    if (e.target) e.target.style.opacity = "";
    dragKey.current = null;
    dragOverKey.current = null;
  };

  const handleDragOver = (e, key) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    dragOverKey.current = key;
  };

  const handleDrop = (e, targetKey) => {
    e.preventDefault();
    const src = dragKey.current;
    if (!src || src === targetKey) return;

    const next = [...columnOrder];
    const fromIdx = next.indexOf(src);
    const toIdx = next.indexOf(targetKey);
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, src);

    onChange({ visibleColumns, columnOrder: next });
    dragKey.current = null;
    dragOverKey.current = null;
  };

  const visibleCount = visibleColumns.length;

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="outline"
        onClick={() => setOpen((v) => !v)}
        className="gap-2"
        data-testid="button-column-manager"
      >
        <Columns className="h-4 w-4" />
        Columns
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-border bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Manage Columns
            </p>
            <span className="text-xs text-muted-foreground">
              {visibleCount}/{orderedDefs.length} shown
            </span>
          </div>

          {/* Hint */}
          <p className="px-4 pt-2 pb-0.5 text-[11px] text-muted-foreground/70 select-none">
            Drag to reorder
          </p>

          {/* Draggable rows */}
          <ul className="py-1.5" role="list">
            {orderedDefs.map((col) => {
              const isVisible = visibleColumns.includes(col.key);
              const onlyOne = visibleCount === 1 && isVisible;

              return (
                <li
                  key={col.key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, col.key)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, col.key)}
                  onDrop={(e) => handleDrop(e, col.key)}
                  className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted/50 cursor-default"
                  data-testid={`column-row-${col.key}`}
                >
                  {/* Drag handle */}
                  <span
                    className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground shrink-0"
                    aria-hidden="true"
                  >
                    <GripVertical className="h-4 w-4" />
                  </span>

                  {/* Checkbox */}
                  <label
                    className={`flex flex-1 cursor-pointer items-center gap-2 ${
                      onlyOne ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    data-testid={`column-toggle-${col.key}`}
                  >
                    <input
                      type="checkbox"
                      checked={isVisible}
                      disabled={onlyOne}
                      onChange={() => toggleVisibility(col.key)}
                      className="h-3.5 w-3.5 rounded border-border accent-primary shrink-0"
                    />
                    <span className={`text-sm ${isVisible ? "text-foreground" : "text-muted-foreground"}`}>
                      {col.label}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          {/* Footer reset */}
          <div className="border-t border-border px-3 py-2">
            <button
              onClick={() =>
                onChange({
                  visibleColumns: ALL_COLUMNS.map((c) => c.key),
                  columnOrder: ALL_COLUMNS.map((c) => c.key),
                })
              }
              className="w-full rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-left"
              data-testid="button-reset-columns"
            >
              Reset to default
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
