import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Droplets,
  Eye,
  FileText,
  Plus,
  Shield,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listKnowledgeDocuments } from '../api/knowledgeApi';
import SOPViewerModal from '../components/SOPViewerModal';
import { getCurrentUser } from '../utils/auth';
import { DashboardView } from './DashboardShared';

const featuredSopCards = [
  {
    documentId: 'KDOC001',
    title: 'Electrical Safety SOP',
    category: 'Electrical Safety',
    type: 'SOP',
    badge: 'High-Risk Safety',
    color: 'red',
    icon: Zap,
    description: 'Immediate actions for water near switchboards, power isolation & electrician Suresh contacts.',
  },
  {
    documentId: 'KDOC002',
    title: 'Plumbing Leakage Handling Guide',
    category: 'Plumbing',
    type: 'Guide',
    badge: 'Containment',
    color: 'blue',
    icon: Droplets,
    description: 'Apartment stopcock shut-off, ceiling drip containment & emergency plumber Ramesh.',
  },
  {
    documentId: 'KDOC003',
    title: 'Lift Emergency Procedure',
    category: 'Lift Safety',
    type: 'SOP',
    badge: 'Passenger Safety',
    color: 'green',
    icon: Zap,
    description: 'Protocol for power trips or entrapment, yellow bell intercom & Otis rescue team.',
  },
  {
    documentId: 'KDOC005',
    title: 'Resident Community Guidelines & Noise Policy',
    category: 'Community Bylaws',
    type: 'Policy',
    badge: 'Living Bylaws',
    color: 'amber',
    icon: FileText,
    description: 'Quiet hours (10 PM - 6 AM), 2-bin wet/dry waste segregation & pet leash regulations.',
  },
];

export default function ResidentDashboard() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [selectedSop, setSelectedSop] = useState(null);
  const [liveDocs, setLiveDocs] = useState([]);

  useEffect(() => {
    listKnowledgeDocuments()
      .then((data) => {
        if (data && data.length > 0) setLiveDocs(data);
      })
      .catch(() => {});
  }, []);

  const handleOpenSop = (card) => {
    // Try to find the matching document with full content from liveDocs
    const found = liveDocs.find(
      (d) =>
        d.documentId === card.documentId ||
        d.title.toLowerCase().includes(card.title.toLowerCase())
    );
    setSelectedSop(found || card);
  };

  const handleAskAboutSop = (question) => {
    navigate('/knowledge-support', { state: { question } });
  };

  return (
    <>
      <div className="resident-quick-banner">
        <div className="resident-quick-banner-text">
          <BookOpen size={20} className="text-primary" />
          <div>
            <strong>Resident Knowledge Support & Emergency SOPs</strong>
            <p>
              Need safety advice or bylaws? Click any Standard Operating Procedure below or search
              the complete knowledge base.
            </p>
          </div>
        </div>
        <Link to="/knowledge-support" className="secondary-button compact-btn">
          Search Knowledge Base &rarr;
        </Link>
      </div>

      <Link className="floating-create" to="/resident/create-complaint">
        <Plus size={18} /> New complaint
      </Link>

      <DashboardView user={user} type="resident" />

      {/* Emergency SOPs & Safety Guidelines Section on Resident Dashboard */}
      <section className="resident-emergency-sop-card">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Emergency procedures & bylaws</span>
            <h2>Safety SOPs & Resident Guidelines</h2>
            <p>Direct 1-click access to verified facility protocols and community living rules.</p>
          </div>
          <Link to="/knowledge-support" className="table-action">
            <span>View all 9 SOPs</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="resident-sop-cards-grid">
          {featuredSopCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.documentId}
                className="resident-sop-mini-card"
                onClick={() => handleOpenSop(card)}
                title={`Click to read full ${card.title}`}
              >
                <div className="resident-sop-card-top">
                  <div className={`sop-icon-badge ${card.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="resident-sop-card-info">
                    <strong>{card.title}</strong>
                    <p>{card.description}</p>
                  </div>
                </div>

                <div className="resident-sop-card-footer">
                  <span className={`sop-type-pill ${card.type.toLowerCase()}`}>
                    {card.badge}
                  </span>
                  <button type="button" className="resident-sop-view-btn">
                    <Eye size={13} />
                    <span>View SOP &rarr;</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SOP Document Viewer Modal */}
      <SOPViewerModal
        doc={selectedSop}
        onClose={() => setSelectedSop(null)}
        onAskQuestion={handleAskAboutSop}
      />
    </>
  );
}
