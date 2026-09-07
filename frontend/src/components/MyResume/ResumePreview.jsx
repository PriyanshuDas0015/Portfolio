import { FileText, Code2, GraduationCap, Layers3 } from 'lucide-react';
export default function ResumePreview({ resume }) {
  return (
    <div className="resume-preview" aria-hidden="true">
      <div className="resume-page">
        <header>
          <div className="resume-monogram">PD</div>
          <div>
            <strong>Priyanshu Das</strong>
            <span>Frontend Developer · CS Undergraduate</span>
          </div>
        </header>
        <div className="document-rule" />
        <div className="document-block">
          <span />
          <i />
          <i />
        </div>
        <div className="document-grid">
          <div>
            <Code2 />
            <i />
            <i />
          </div>
          <div>
            <Layers3 />
            <i />
            <i />
          </div>
        </div>
        <div className="document-block short">
          <GraduationCap />
          <i />
          <i />
        </div>
        <footer>
          <FileText />
          {resume?.fileName || 'Resume ready for upload'}
        </footer>
      </div>
      <div className="resume-page-shadow" />
    </div>
  );
}
