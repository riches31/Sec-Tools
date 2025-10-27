import React, { useState, useEffect } from 'react';
import { Clock, Trash2, X, Search } from 'lucide-react';
import { getHistory, deleteHistoryEntry, clearHistory, formatHistoryTimestamp, ToolType, HistoryEntry } from './history-manager';

interface HistoryPanelProps {
  tool: ToolType;
  onSelect: (input: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryPanel({ tool, onSelect, isOpen, onClose }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, tool]);

  const loadHistory = () => {
    const entries = getHistory(tool);
    setHistory(entries);
  };

  const handleDelete = (id: string) => {
    deleteHistoryEntry(tool, id);
    loadHistory();
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history for this tool?')) {
      clearHistory(tool);
      loadHistory();
    }
  };

  const filteredHistory = searchQuery
    ? history.filter(entry =>
        entry.input.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : history;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 dark:border-slate-700/40 w-full max-w-2xl max-h-[80vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Recent Checks</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Search */}
        {history.length > 0 && (
          <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-10 pr-4 py-2 border-2 border-slate-300/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white/50 dark:bg-slate-700/50 text-slate-800 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* History List */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-200px)]">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                {searchQuery ? 'No matching history found' : 'No recent checks yet'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                Your recent checks will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => {
                        onSelect(entry.input);
                        onClose();
                      }}
                      className="w-full text-left"
                    >
                      <p className="font-mono text-sm text-slate-800 dark:text-slate-200 truncate">
                        {entry.input}
                      </p>
                      {entry.summary && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">
                          {entry.summary}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {formatHistoryTimestamp(entry.timestamp)}
                      </p>
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-rose-500/20 transition-all"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {history.length} {history.length === 1 ? 'entry' : 'entries'}
            </p>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
