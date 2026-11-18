import { apiRequest } from './apiClient';

export const listKnowledgeDocuments = () => apiRequest('/knowledge/documents');
export const getKnowledgeDocument = (documentId) => apiRequest(`/knowledge/documents/${documentId}`);
export const createKnowledgeDocument = (body) => apiRequest('/knowledge/documents', { method: 'POST', body: JSON.stringify(body) });
export const queryKnowledge = (question, ticketId) => apiRequest('/knowledge/query', { method: 'POST', body: JSON.stringify({ question, ticketId }) });
export const reindexKnowledgeDocument = (documentId) => apiRequest(`/knowledge/documents/${documentId}/reindex`, { method: 'POST', body: '{}' });
export const getKnowledgeChunks = (documentId) => apiRequest(`/knowledge/chunks/${documentId}`);

// GraphRAG & Evaluation API Endpoints
export const getGraphStats = () => apiRequest('/knowledge/graph/stats');
export const extractGraphEntities = (text, persist = false) => apiRequest('/knowledge/graph/extract', { method: 'POST', body: JSON.stringify({ text, persist }) });
export const queryMultiHopGraph = (query, maxDepth = 2) => apiRequest('/knowledge/graph/query', { method: 'POST', body: JSON.stringify({ query, maxDepth }) });
export const bootstrapGraphFromCrm = () => apiRequest('/knowledge/graph/bootstrap', { method: 'POST', body: '{}' });
export const runRagasEvaluation = (testCases = null) => apiRequest('/knowledge/evaluation/ragas', { method: 'POST', body: JSON.stringify({ testCases }) });
export const getLatestRagasEvaluation = () => apiRequest('/knowledge/evaluation/latest');
