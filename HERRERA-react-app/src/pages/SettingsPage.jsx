const settings = [
  "Academic Calendar Sync",
  "SMS Notification Gateway",
  "Payment Provider Mapping",
  "Role and Access Permissions",
  "API Connection Health",
];

export default function SettingsPage() {
  return (
    <section className="single-pane glass-card">
      <div className="section-title-row">
        <h3>System Settings</h3>
        <p>Configuration placeholder for admin controls</p>
      </div>
      <ul className="settings-list">
        {settings.map((setting) => (
          <li key={setting}>
            <span>{setting}</span>
            <button type="button" className="ghost-btn">
              Configure
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
