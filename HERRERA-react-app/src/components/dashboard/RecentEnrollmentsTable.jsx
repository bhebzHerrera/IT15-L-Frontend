export default function RecentEnrollmentsTable({ records }) {
  return (
    <article className="table-card glass-card">
      <div className="section-title-row">
        <h3>Recent Applications</h3>
        <p>Latest enrollment entries</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Program</th>
              <th>Status</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.name}</td>
                <td>{record.program}</td>
                <td>
                  <span className={`status-chip status-${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </td>
                <td>{record.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
