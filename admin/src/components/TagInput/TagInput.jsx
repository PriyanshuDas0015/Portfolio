import { useState } from 'react';
import { X } from 'lucide-react';

export default function TagInput({ label, value, onChange }) {
  const [draft, setDraft] = useState('');
  const tags = String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const add = () => {
    const next = draft.trim();
    if (next && !tags.some((tag) => tag.toLowerCase() === next.toLowerCase()))
      onChange([...tags, next].join(', '));
    setDraft('');
  };
  return (
    <label className="admin-field tag-input-field">
      <span>{label}</span>
      <div className="tag-input">
        {tags.map((tag) => (
          <span key={tag}>
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(tags.filter((item) => item !== tag).join(', '))}
            >
              <X />
            </button>
          </span>
        ))}
        <input
          aria-label="Add technology"
          value={draft}
          placeholder={tags.length ? 'Add another…' : 'Type a technology and press Enter'}
          onBlur={add}
          onChange={(event) => setDraft(event.target.value.replace(',', ''))}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              add();
            }
          }}
        />
      </div>
    </label>
  );
}
