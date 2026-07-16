// Maps our Prisma Status enum values to the CSS class suffixes used in theme.css
export function statusClass(status) {
  if (status === 'Open') return 'status-open';
  if (status === 'InProgress') return 'status-in_progress';
  if (status === 'Resolved') return 'status-resolved';
  return '';
}

export function statusLabel(status) {
  if (status === 'InProgress') return 'In Progress';
  return status;
}

export function priorityClass(priority) {
  return `badge-${priority.toLowerCase()}`;
}

export function formatTicketRef(id) {
  return `#T-${String(id).padStart(6, '0')}`;
}
