import { Eye, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';
import { formatDateTime } from '../utils/dateUtils';

export default function TicketTable({ tickets, compact = false }) {
  if (!tickets.length) return <EmptyState icon={Ticket} title="No tickets to show" description="Tickets available to this role will appear here." />;
  return (
    <div className="table-wrap"><table><thead><tr>
      <th>Ticket</th><th>Title</th>{!compact && <><th>Resident</th><th>Apartment</th><th>Block</th><th>Category</th><th>Severity</th><th>Safety</th></>}<th>Status</th>{!compact && <><th>Technician</th><th>Created</th></>}<th></th>
    </tr></thead><tbody>{tickets.map((ticket) => {
      const ticketId = ticket.id || ticket.ticketId;
      return (
        <tr key={ticketId}>
          <td><strong className="ticket-id">{ticketId}</strong></td><td><span className="cell-title">{ticket.title}</span></td>
          {!compact && <><td>{ticket.residentName || ticket.residentId}</td><td>{ticket.apartmentNumber || ticket.apartmentId}</td><td>{ticket.blockName || ticket.blockId}</td><td>{ticket.category}</td><td><StatusBadge value={ticket.severity === 'High' ? 'High Risk' : ticket.severity}>{ticket.severity}</StatusBadge></td><td>{ticket.safetyRisk ? <StatusBadge value="High Risk">Yes</StatusBadge> : 'No'}</td></>}
          <td><StatusBadge>{ticket.status}</StatusBadge></td>
          {!compact && <><td>{ticket.assignedTechnicianName || 'Unassigned'}</td><td>{formatDateTime(ticket.createdAt)}</td></>}
          <td><Link className="view-link" to={`/tickets/${ticketId}`} aria-label={`View ${ticketId}`}><Eye size={15} /> View details</Link></td>
        </tr>
      );
    })}</tbody></table></div>
  );
}
