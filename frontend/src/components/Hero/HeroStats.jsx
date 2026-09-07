const normalizeEducation = (education) => {
  const item = Array.isArray(education) ? education[0] : education;
  if (!item) return { degree: 'B.Tech CSE', institution: 'SRM University' };
  const isBtech = /bachelor of technology|b\.?tech/i.test(item.degree || '');
  const isCse = /computer science/i.test(item.field || '');
  return {
    degree: isBtech ? `B.Tech${isCse ? ' CSE' : ''}` : item.degree,
    institution: item.institution,
  };
};

export default function HeroStats({ projectCount, education, availability }) {
  const academic = normalizeEducation(education);
  const items = [
    [String(projectCount), projectCount === 1 ? 'Published Project' : 'Published Projects'],
    [academic.degree, academic.institution],
    ['Always', 'Learning New Things'],
    ['Open', availability || 'To Opportunities'],
  ];
  return (
    <div className="hero-stats glass" aria-label="Portfolio quick facts">
      {items.map(([value, label]) => (
        <div className="hero-stat" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
