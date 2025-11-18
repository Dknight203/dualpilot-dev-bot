// dualpilot-dev-bot: no database migrations needed.
// This script is only here so "tsx lib/db/migrate && next build" succeeds
// without requiring POSTGRES_URL.

console.log("Skipping migrations - POSTGRES_URL is not configured for dualpilot-dev-bot.");
