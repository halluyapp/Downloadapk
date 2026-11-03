import React from 'react';
import { X, HardDrive, Smartphone, Archive, Download, Trash2, PieChart } from 'lucide-react';
import { StorageStats } from '../types/file';
import { formatBytes } from '../utils/fileHelpers';

interface StorageStatsModalProps {
  isOpen: boolean;
  stats: StorageStats;
  onClose: () => void;
  onClearAllUserFiles?: () => void;
}

export const StorageStatsModal: React.FC<StorageStatsModalProps> = ({
  isOpen,
  stats,
  onClose,
  onClearAllUserFiles,
}) => {
  if (!isOpen) return null;

  const total = stats.totalBytes || 1;
  const apkPercent = Math.round((stats.apkBytes / total) * 100);
  const zipPercent = Math.round((stats.zipBytes / total) * 100);
  const otherPercent = Math.max(0, 100 - apkPercent - zipPercent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Repository Storage Analytics</h2>
              <p className="text-xs text-slate-400">IndexedDB local storage breakdown</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Total Storage Occupied</span>
            <span className="text-emerald-400">{formatBytes(stats.totalBytes)}</span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${apkPercent}%` }}
              title={`APKs: ${formatBytes(stats.apkBytes)} (${apkPercent}%)`}
            />
            <div
              className="bg-cyan-500 h-full transition-all duration-300"
              style={{ width: `${zipPercent}%` }}
              title={`ZIP Archives: ${formatBytes(stats.zipBytes)} (${zipPercent}%)`}
            />
            <div
              className="bg-purple-500 h-full transition-all duration-300"
              style={{ width: `${otherPercent}%` }}
              title={`Other: ${formatBytes(stats.otherBytes)} (${otherPercent}%)`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              APKs ({apkPercent}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              ZIPs ({zipPercent}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              Other ({otherPercent}%)
            </span>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950 p-3.5 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
              <Smartphone className="w-4 h-4" />
              <span>APKs Hosted</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.apkCount}</div>
            <div className="text-xs text-slate-400">{formatBytes(stats.apkBytes)}</div>
          </div>

          <div className="bg-slate-950 p-3.5 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
              <Archive className="w-4 h-4" />
              <span>ZIP Archives</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.zipCount}</div>
            <div className="text-xs text-slate-400">{formatBytes(stats.zipBytes)}</div>
          </div>

          <div className="bg-slate-950 p-3.5 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
              <Download className="w-4 h-4" />
              <span>Total Downloads</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.totalDownloads.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Lifetime transfers</div>
          </div>

          <div className="bg-slate-950 p-3.5 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
              <PieChart className="w-4 h-4" />
              <span>Total Files</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.totalCount}</div>
            <div className="text-xs text-slate-400">In repository</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
