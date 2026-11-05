// Production environment — swapped in by angular.json fileReplacements at build time.
// The API URL can be overridden at runtime by setting window.__API_BASE_URL__ in index.html
// (same pattern as the showcase-angular-php deployment).
declare global {
  interface Window {
    __API_BASE_URL__?: string;
  }
}

export const environment = {
  production: true,
  apiUrl: (typeof window !== 'undefined' && window.__API_BASE_URL__) || '/api/scent-store/index.php',
};
