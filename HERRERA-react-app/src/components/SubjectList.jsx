import React, { useMemo, useState } from "react";
import { subjects } from "../data/mockData";
import FilterBar from "./FilterBar";
import SubjectCard from "./SubjectCard";
import SubjectDetails from "./SubjectDetails";

// Main Subject Offerings module: table listing + filters + details modal
export default function SubjectList() {
  const [search, setSearch] = useState("");
  const [termFilter, setTermFilter] = useState("");
  const [unitsFilter, setUnitsFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [preReqFilter, setPreReqFilter] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Derive unique program list for dropdown
  const programOptions = Array.from(
    new Set(subjects.map((s) => s.program).filter(Boolean))
  );

  // Apply all filter rules to the mock subject list
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const matchesSearch =
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        s.title.toLowerCase().includes(search.toLowerCase());

      const matchesTerm = termFilter ? s.term === termFilter : true;

      const matchesUnits = unitsFilter
        ? Number(s.units) === Number(unitsFilter)
        : true;

      const matchesProgram = programFilter ? s.program === programFilter : true;

      const hasPreReq = s.preRequisites && s.preRequisites.length > 0;
      const matchesPreReq =
        preReqFilter === "with"
          ? hasPreReq
          : preReqFilter === "without"
          ? !hasPreReq
          : true;

      return (
        matchesSearch &&
        matchesTerm &&
        matchesUnits &&
        matchesProgram &&
        matchesPreReq
      );
    });
  }, [search, termFilter, unitsFilter, programFilter, preReqFilter]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Subject Offerings</div>
        <div className="page-sub">
          Browse all subjects, see their term, and check prerequisites.
        </div>
      </div>

      <div className="table-card">
        <FilterBar
          searchPlaceholder="Search by subject code or title…"
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              label: "Semester / Term",
              value: termFilter,
              onChange: setTermFilter,
              options: ["Semester", "Term", "Both"],
            },
            {
              label: "Units",
              value: unitsFilter,
              onChange: setUnitsFilter,
              options: ["2", "3", "4"],
            },
            {
              label: "Program",
              value: programFilter,
              onChange: setProgramFilter,
              options: programOptions,
            },
            {
              label: "With / Without Pre‑req",
              value: preReqFilter,
              onChange: setPreReqFilter,
              options: ["with", "without"],
            },
          ]}
        />

        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Units</th>
              <th>Semester / Term</th>
              <th>Program</th>
              <th>Short Description</th>
              <th>Pre‑requisites</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((s) => (
              <SubjectCard
                key={s.code}
                subject={s}
                onSelect={(subj) => setSelectedSubject(subj)}
              />
            ))}
            {filteredSubjects.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{ padding: 16, fontSize: 13, color: "var(--text2)" }}
                >
                  No subjects match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for individual subject details */}
      <SubjectDetails
        subject={selectedSubject}
        onClose={() => setSelectedSubject(null)}
      />
    </div>
  );
}

