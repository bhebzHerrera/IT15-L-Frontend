export default function ActivityFeed({ activities }) {
  return (
    <article className="activity-card glass-card">
      <div className="section-title-row">
        <h3>Activity Feed</h3>
        <p>Latest registrar actions</p>
      </div>
      <ul>
        {activities.map((item) => (
          <li key={item.id}>
            <span className="activity-dot" />
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
            <time>{item.time}</time>
          </li>
        ))}
      </ul>
    </article>
  );
}
