import { ArrowUpRight, Check } from 'lucide-react';
import Reveal from '../Shared/Reveal';
export default function TimelineItem({ item, index }) {
  return (
    <Reveal className={`timeline-item ${item.current ? 'timeline-current' : ''}`}>
      <span className="timeline-marker">
        {item.current ? <ArrowUpRight size={13} /> : <Check size={12} />}
      </span>
      <div className="timeline-meta">
        <span>{item.label}</span>
        <small>{item.current ? 'IN PROGRESS' : `MILESTONE 0${index + 1}`}</small>
      </div>
      <h3>{item.title}</h3>
      {(item.startDate || item.endDate || item.date) && (
        <small className="timeline-dates">
          {item.startDate
            ? `${item.startDate} – ${item.current ? 'Present' : item.endDate || 'Present'}`
            : item.date}
        </small>
      )}
      <p>{item.description}</p>
      {item.technologies?.length > 0 && (
        <div className="timeline-technologies">
          {item.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      )}
    </Reveal>
  );
}
