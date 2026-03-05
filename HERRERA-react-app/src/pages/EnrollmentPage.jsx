import { useEffect, useState } from "react";
import { getEnrollmentPipeline } from "../services/enrollmentService";

export default function EnrollmentPage() {
  const [pipeline, setPipeline] = useState([]);

  useEffect(() => {
    getEnrollmentPipeline().then(setPipeline);
  }, []);

  return (
    <section className="single-pane glass-card">
      <div className="section-title-row">
        <h3>Enrollment </h3>
        <p>Track applicant progress through each stage</p>
      </div>
      <div className="pipeline-grid">
        {pipeline.map((item) => (
          <article key={item.stage} className="pipeline-card glass-card">
            <p>{item.stage}</p>
            <h4>{item.count}</h4>
          </article>
        ))}
      </div>
    </section>
  );
}
