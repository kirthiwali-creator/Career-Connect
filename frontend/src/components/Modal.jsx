// Simple popup dialog. Shown only when "open" is true.
export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* stopPropagation: clicking inside the box should not close it */}
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="alert-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}
