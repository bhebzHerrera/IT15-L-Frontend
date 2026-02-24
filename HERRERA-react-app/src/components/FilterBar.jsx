import React from "react";

// Reusable filter bar for search + select filters
export default function FilterBar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filters,
}) {
  return (
    <div className="table-header">
      <div className="table-title">Filters</div>
      <div className="table-actions" style={{ gap: 8, flexWrap: "wrap" }}>
        {/* Simple search box */}
        <input
          className="search-input"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {/* Dynamic select boxes based on filters config */}
        {filters.map((f) => (
          <select
            key={f.label}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)",
              fontSize: 13,
            }}
          >
            <option value="">{f.label}</option>
            {f.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}

