import { useEffect, useState } from "react";
import { getReportCards } from "../services/enrollmentService";

export default function ReportsPage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    getReportCards().then(setCards);
  }, []);

  return (
    <section className="single-pane glass-card">
      <div className="section-title-row">
        <h3>Reports Snapshot</h3>
        <p>Sample executive metrics for decision-making</p>
      </div>
      <div className="report-grid">
        {cards.map((card) => (
          <article key={card.label} className="report-card glass-card">
            <p>{card.label}</p>
            <h4>{card.value}</h4>
          </article>
        ))}
      </div>
    </section>
  );
}
