import React, { useMemo, useState } from "react";
import { programs } from "../data/mockData";
import FilterBar from "./FilterBar";
import ProgramCard from "./ProgramCard";
import ProgramDetails from "./ProgramDetails";

// Main Program Offerings module: list + filters + details panel
export default function ProgramList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Compute filtered list based on search and dropdowns
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchesSearch =
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? p.status === statusFilter : true;
      const matchesType = typeFilter ? p.type === typeFilter : true;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Program Offerings</div>
        <div className="page-sub">
          View, filter, and inspect details of all academic programs.
        </div>
      </div>

      <div className="table-card">
        <FilterBar
          searchPlaceholder="Search by program code or name…"
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              label: "Status",
              value: statusFilter,
              onChange: setStatusFilter,
              options: ["Active", "Phased Out", "Under Review"],
            },
            {
              label: "Program Type",
              value: typeFilter,
              onChange: setTypeFilter,
              options: ["Bachelor's", "Diploma"],
            },
          ]}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 2fr",
            gap: 16,
            padding: "16px 22px 22px",
          }}
        >
          {/* LEFT: Program cards list */}
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            {filteredPrograms.map((p) => (
              <ProgramCard
                key={p.id}
                program={p}
                onSelect={(prog) => setSelectedProgram(prog)}
              />
            ))}
            {filteredPrograms.length === 0 && (
              <div style={{ fontSize: 13, color: "var(--text2)" }}>
                No programs match the applied filters.
              </div>
            )}
          </div>

          {/* RIGHT: Details view for the selected program */}
          <ProgramDetails program={selectedProgram || filteredPrograms[0]} />
        </div>
      </div>
    </div>
  );
}

