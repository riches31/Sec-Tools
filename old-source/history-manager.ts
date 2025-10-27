// History Manager for Security Tools Suite
// Manages recent checks using localStorage

export type ToolType = 'domain' | 'password' | 'url' | 'ssl' | 'email' | 'hash' | 'browser';

export interface HistoryEntry {
  id: string;
  tool: ToolType;
  input: string;
  timestamp: number;
  result?: any;
  summary?: string;
}

const STORAGE_PREFIX = 'sec-tools-history';
const MAX_HISTORY_PER_TOOL = 10;

/**
 * Get storage key for a specific tool
 */
function getStorageKey(tool: ToolType): string {
  return `${STORAGE_PREFIX}-${tool}`;
}

/**
 * Add an entry to history
 */
export function addToHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
  const storageKey = getStorageKey(entry.tool);
  const history = getHistory(entry.tool);

  const newEntry: HistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now()
  };

  // Add to beginning of array
  history.unshift(newEntry);

  // Keep only MAX_HISTORY_PER_TOOL entries
  const trimmedHistory = history.slice(0, MAX_HISTORY_PER_TOOL);

  try {
    localStorage.setItem(storageKey, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save to history:', error);
    // If localStorage is full, try clearing old entries
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearHistory(entry.tool);
      // Try again with just the new entry
      localStorage.setItem(storageKey, JSON.stringify([newEntry]));
    }
  }
}

/**
 * Get history for a specific tool
 */
export function getHistory(tool: ToolType): HistoryEntry[] {
  const storageKey = getStorageKey(tool);
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/**
 * Get all history across all tools
 */
export function getAllHistory(): HistoryEntry[] {
  const tools: ToolType[] = ['domain', 'password', 'url', 'ssl', 'email', 'hash', 'browser'];
  const allHistory: HistoryEntry[] = [];

  tools.forEach(tool => {
    allHistory.push(...getHistory(tool));
  });

  // Sort by timestamp descending
  return allHistory.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Delete a specific history entry
 */
export function deleteHistoryEntry(tool: ToolType, id: string): void {
  const history = getHistory(tool);
  const filtered = history.filter(entry => entry.id !== id);
  const storageKey = getStorageKey(tool);

  try {
    localStorage.setItem(storageKey, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete history entry:', error);
  }
}

/**
 * Clear all history for a specific tool
 */
export function clearHistory(tool: ToolType): void {
  const storageKey = getStorageKey(tool);
  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

/**
 * Clear all history across all tools
 */
export function clearAllHistory(): void {
  const tools: ToolType[] = ['domain', 'password', 'url', 'ssl', 'email', 'hash', 'browser'];
  tools.forEach(tool => clearHistory(tool));
}

/**
 * Format timestamp for display
 */
export function formatHistoryTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}

/**
 * Search history by input text
 */
export function searchHistory(query: string, tool?: ToolType): HistoryEntry[] {
  const history = tool ? getHistory(tool) : getAllHistory();
  const lowerQuery = query.toLowerCase();

  return history.filter(entry =>
    entry.input.toLowerCase().includes(lowerQuery) ||
    entry.summary?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get total history count
 */
export function getHistoryCount(): { total: number; byTool: Record<ToolType, number> } {
  const tools: ToolType[] = ['domain', 'password', 'url', 'ssl', 'email', 'hash', 'browser'];
  const byTool: Record<ToolType, number> = {} as Record<ToolType, number>;
  let total = 0;

  tools.forEach(tool => {
    const count = getHistory(tool).length;
    byTool[tool] = count;
    total += count;
  });

  return { total, byTool };
}
