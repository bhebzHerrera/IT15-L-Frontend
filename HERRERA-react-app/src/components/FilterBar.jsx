export default function FilterBar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filters,
}) {
  return (
    <div
      className="glass-card"
      style={{
        padding: 12,
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
      }}
    >
      <input
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        style={{
          minWidth: 220,
          flex: 1,
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 10,
          background: "rgba(12,15,48,0.55)",
          color: "var(--text-main)",
          padding: "10px 12px",
        }}
      />
      {filters.map((filter) => (
        <select
          key={filter.label}
          value={filter.value}
          onChange={(event) => filter.onChange(event.target.value)}
          style={{
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 10,
            background: "rgba(12,15,48,0.55)",
            color: "var(--text-main)",
            padding: "10px 12px",
          }}
        >
          <option value="">{filter.label}</option>
          {filter.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
