import { statusClass, statusLabel, priorityClass } from '../lib/ticketFormat';

export function PriorityBadge({ priority }) {
  return <span className={`badge ${priorityClass(priority)}`}>{priority}</span>;
}

export function StatusBadge({ status }) {
  return <span className={`badge ${statusClass(status)}`}>{statusLabel(status)}</span>;
}
