import './TornDivider.css';

export default function TornDivider({ className = '' }) {
  return <div className={`torn-divider ${className}`} aria-hidden="true" />;
}
