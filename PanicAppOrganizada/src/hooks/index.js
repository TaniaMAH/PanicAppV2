/**
 * 🎣 EXPORTAR TODOS LOS HOOKS
 * ===========================
 */

export { default as useLocation } from './useLocation';
export { default as useContacts } from './useContacts';
export { default as useEmergency } from './useEmergency';
export { default as usePermissions } from './usePermissions';

// Re-exportar desde context
export { useApp } from '../context/AppContext';
