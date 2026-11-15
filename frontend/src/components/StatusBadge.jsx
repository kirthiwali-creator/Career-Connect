// Coloured badge for pending / accepted / rejected / answered ...
export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}
