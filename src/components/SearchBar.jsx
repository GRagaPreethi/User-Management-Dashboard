import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar({ onSearch }) {
  const [localValue, setLocalValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(localValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, onSearch]);

  return (
    <div className="relative w-full md:w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search users..."
        className="pl-9 w-full bg-white"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        data-testid="input-search"
      />
    </div>
  );
}
