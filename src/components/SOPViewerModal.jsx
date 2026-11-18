import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Droplets,
  ExternalLink,
  FileText,
  Flame,
  Phone,
  Shield,
  Sparkles,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getKnowledgeDocument } from '../api/knowledgeApi';

export default function SOPViewerModal({ doc, onClose, onAskQuestion }) {
  const [fullDoc, setFullDoc] = useState(doc || null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!doc) {
      setFullDoc(null);
      return;
    }
    setFullDoc(doc);
    // If the document has no content or minimal content, fetch the full content from API
    if (doc.documentId && (!doc.content || doc.content.length < 100)) {
      setLoading(true);
      getKnowledgeDocument(doc.documentId)
        .then((data) => {
          if (data && data.content) {
            setFullDoc((prev) => ({ ...prev, ...data }));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [doc]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!doc) return null;

  const currentDoc = fullDoc || doc;
  const category = (currentDoc.category || '').toLowerCase();
  const type = (currentDoc.type || 'SOP').toUpperCase();

  const getCategoryColor = () => {
    if (category.includes('electric')) return 'red';
    if (category.includes('plumb')) return 'blue';
    if (category.includes('lift')) return 'green';
    if (category.includes('secur')) return 'purple';
    if (category.includes('fire')) return 'red';
    if (category.includes('gas')) return 'amber';
    if (category.includes('bylaw') || category.includes('guideline')) return 'amber';
    return 'blue';
  };

  const getCategoryIcon = () => {
    if (category.includes('electric')) return <Zap size={22} />;
    if (category.includes('plumb')) return <Droplets size={22} />;
    if (category.includes('lift')) return <Zap size={22} />;
    if (category.includes('secur')) return <Shield size={22} />;
    if (category.includes('fire')) return <Flame size={22} />;
    if (category.includes('gas')) return <Wind size={22} />;
    return <BookOpen size={22} />;
  };

  const handleCopy = () => {
    if (!currentDoc.content) return;
    navigator.clipboard.writeText(
      `${currentDoc.title}\nCategory: ${currentDoc.category} | Type: ${currentDoc.type}\n\n${currentDoc.content}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleAskAI = () => {
    const suggestedQuestion = `What are the key instructions and emergency precautions in the ${currentDoc.title}?`;
    if (onAskQuestion) {
      onAskQuestion(suggestedQuestion, currentDoc);
    }
    onClose();
  };

  // Format content paragraphs into styled blocks
  const renderFormattedContent = (content = '') => {
    if (!content) {
      return (
        <div className="sop-empty-state">
          <FileText size={32} />
          <p>No content available for this document.</p>
        </div>
      );
    }

    const lines = content.split('\n');
    return (
      <div className="sop-text-content">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="sop-spacer" />;
          }

          // Main Header or Section Header
          if (trimmed.startsWith('# ') || /^[1-9]\.\s+[A-Z\s&,()-]+$/.test(trimmed)) {
            return (
              <h3 key={idx} className="sop-section-title">
                {trimmed.replace(/^#\s*/, '')}
              </h3>
            );
          }

          // FAQ Question
          if (/^Q\d+:/.test(trimmed)) {
            return (
              <div key={idx} className="sop-faq-q">
                <strong>{trimmed}</strong>
              </div>
            );
          }

          // FAQ Answer
          if (/^A:/.test(trimmed)) {
            return (
              <p key={idx} className="sop-faq-a">
                {trimmed}
              </p>
            );
          }

          // Emergency steps / Bullet points
          if (trimmed.startsWith('- STEP') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const isEmergencyStep = trimmed.includes('STEP');
            const isDanger = /NEVER|PROHIBITED|DO NOT|EXPLOSION|FIRE|WATER INGRESS|EVACUATE/i.test(trimmed);
            return (
              <div
                key={idx}
                className={`sop-step-item ${isEmergencyStep ? 'highlight' : ''} ${isDanger ? 'danger' : ''}`}
              >
                <div className="sop-bullet-dot" />
                <div className="sop-step-text">
                  {trimmed.replace(/^[-*]\s*/, '')}
                </div>
              </div>
            );
          }

          // Subheaders or metadata
          if (trimmed.startsWith('Document ID:') || trimmed.startsWith('Version:')) {
            return (
              <div key={idx} className="sop-meta-tag-line">
                {trimmed}
              </div>
            );
          }

          // Phone contacts highlight
          if (/mobile:|hotline:|helpline:|extension #|phone/i.test(trimmed)) {
            return (
              <div key={idx} className="sop-contact-callout">
                <Phone size={14} className="sop-callout-icon" />
                <span>{trimmed.replace(/^[-*]\s*/, '')}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="sop-paragraph">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  const themeColor = getCategoryColor();

  return (
    <div className="modal-backdrop sop-modal-backdrop" onClick={onClose}>
      <div
        className="sop-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sop-modal-title"
      >
        {/* Modal Top Header */}
        <div className="sop-modal-header">
          <div className="sop-header-main">
            <div className={`sop-icon-badge ${themeColor}`}>
              {getCategoryIcon()}
            </div>
            <div className="sop-title-block">
              <div className="sop-badges-row">
                <span className={`sop-type-pill ${type.toLowerCase()}`}>{type}</span>
                <span className="sop-category-pill">{currentDoc.category}</span>
                <span className="sop-status-pill">
                  <CheckCircle2 size={11} /> INDEXED
                </span>
                {currentDoc.documentId && (
                  <span className="sop-id-pill">{currentDoc.documentId}</span>
                )}
              </div>
              <h2 id="sop-modal-title">{currentDoc.title}</h2>
            </div>
          </div>
          <button
            type="button"
            className="sop-close-btn"
            onClick={onClose}
            aria-label="Close SOP viewer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="sop-modal-body">
          {loading ? (
            <div className="sop-loading-indicator">
              <div className="sop-spinner" />
              <span>Loading full standard operating procedure...</span>
            </div>
          ) : (
            <>
              {/* Emergency Safety Alert Notice */}
              {(category.includes('electric') ||
                category.includes('lift') ||
                category.includes('fire') ||
                category.includes('gas')) && (
                <div className="sop-emergency-callout-banner">
                  <AlertTriangle size={18} className="text-amber" />
                  <div>
                    <strong>Life-Safety Notice & Mandatory Compliance</strong>
                    <p>
                      This document contains approved life-safety operating procedures.
                      In case of immediate threat or physical danger, alert Estate Security (#999) or
                      dial emergency services (112) first.
                    </p>
                  </div>
                </div>
              )}

              {/* Formatted Content */}
              {renderFormattedContent(currentDoc.content)}
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="sop-modal-footer">
          <div className="sop-footer-left">
            <button
              type="button"
              className="sop-secondary-action-btn"
              onClick={handleCopy}
              disabled={!currentDoc.content}
            >
              {copied ? <Check size={15} className="text-green" /> : <Copy size={15} />}
              <span>{copied ? 'Copied to clipboard' : 'Copy SOP text'}</span>
            </button>
          </div>

          <div className="sop-footer-right">
            {onAskQuestion && (
              <button
                type="button"
                className="sop-ai-action-btn"
                onClick={handleAskAI}
              >
                <Sparkles size={15} />
                <span>Ask AI about this SOP</span>
              </button>
            )}
            <button
              type="button"
              className="primary-button sop-done-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
