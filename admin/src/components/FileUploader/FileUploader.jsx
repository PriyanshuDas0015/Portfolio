import { useRef, useState } from 'react';
import { UploadCloud, FileText, Image } from 'lucide-react';
export default function FileUploader({ label, accept, maxSize, onFile, kind = 'image', file }) {
  const input = useRef();
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');
  const select = (chosen) => {
    if (!chosen) return;
    if (chosen.size > maxSize) {
      setError(`Maximum file size is ${Math.round(maxSize / 1e6)} MB.`);
      return;
    }
    setError('');
    onFile(chosen);
  };
  return (
    <div>
      <span className="file-label">{label}</span>
      <div
        className={`file-drop ${drag ? 'dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          select(e.dataTransfer.files[0]);
        }}
      >
        <input
          ref={input}
          type="file"
          accept={accept}
          onChange={(e) => select(e.target.files[0])}
        />
        {kind === 'pdf' ? <FileText /> : <Image />}
        <strong>{file?.name || 'Drop a file here'}</strong>
        <span>
          {file ? `${(file.size / 1e6).toFixed(2)} MB` : 'or choose one from your computer'}
        </span>
        <button
          type="button"
          className="admin-button secondary"
          onClick={() => input.current.click()}
        >
          <UploadCloud />
          Choose File
        </button>
      </div>
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}
