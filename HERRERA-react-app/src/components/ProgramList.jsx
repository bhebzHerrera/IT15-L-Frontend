import { useMemo, useState } from "react";
import { programs } from "../data/mockData";
import FilterBar from "./FilterBar";
import ProgramCard from "./ProgramCard";
import ProgramDetails from "./ProgramDetails";

export default function ProgramList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(programs[0] || null);
  const [showDesignModal, setShowDesignModal] = useState(false);

  const filteredPrograms = useMemo(
    () =>
      programs.filter((program) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          program.code.toLowerCase().includes(query) ||
          program.name.toLowerCase().includes(query);
        const matchesStatus = statusFilter ? program.status === statusFilter : true;
        const matchesType = typeFilter ? program.type === typeFilter : true;
        return matchesSearch && matchesStatus && matchesType;
      }),
    [search, statusFilter, typeFilter]
  );

  const detailsProgram =
    selectedProgram && filteredPrograms.some((program) => program.id === selectedProgram.id)
      ? selectedProgram
      : filteredPrograms[0] || null;

  return (
    <section className="single-pane glass-card">
      <div className="section-title-row">
        <h3>Program Offerings</h3>
        <p>List, filter, and inspect program details</p>
      </div>

      <FilterBar
        searchPlaceholder="Search by program code or name"
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

      <div className="module-actions">
        <button type="button" className="ghost-btn" onClick={() => setShowDesignModal(true)}>
          Add/Edit Program (Design Only)
        </button>
      </div>

      <div className="program-layout">
        <div className="program-list-pane">
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              selected={detailsProgram?.id === program.id}
              onSelect={setSelectedProgram}
            />
          ))}
          {filteredPrograms.length === 0 ? (
            <p className="program-empty">No programs found.</p>
          ) : null}
        </div>
        <ProgramDetails program={detailsProgram} />
      </div>

      {showDesignModal ? (
        <div onClick={() => setShowDesignModal(false)} className="modal-backdrop">
          <div
            className="glass-card modal-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="modal-title">Program Form (Design Only)</h3>
            <p className="modal-subtitle">
              This modal is a frontend placeholder for future add/edit program form.
            </p>
            <div className="modal-grid">
              <input placeholder="Program Code" />
              <input placeholder="Program Name" />
              <div className="modal-field-row">
                <input placeholder="Program Type" />
                <input placeholder="Duration (years)" />
                <input placeholder="Total Units" />
              </div>
              <textarea placeholder="Description" rows={4} style={{ borderRadius: 12, padding: 12 }} />
            </div>
            <div className="modal-actions">
              <button type="button" className="ghost-btn" onClick={() => setShowDesignModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
