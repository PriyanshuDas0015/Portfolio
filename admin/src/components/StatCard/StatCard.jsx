export default function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <article className="stat-card" style={{ '--accent': accent }}>
      <div className="stat-icon">
        <Icon />
      </div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}
