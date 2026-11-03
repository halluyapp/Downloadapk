import React from 'react';
import { HardDrive, Upload, LayoutGrid, List, Smartphone, Archive, Search } from 'lucide-react';
import { StorageStats } from '../types/file';
import { formatBytes } from '../utils/fileHelpers';

interface HeaderProps {
  stats: StorageStats;
  onOpenUpload: () => void;
  onOpenStorageStats: () => void;
  viewMode: 'grid' | 'list';
  onToggleViewMode: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  onOpenUpload,
  onOpenStorageStats,
  viewMode,
  onToggleViewMode,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                  APKVault
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  Direct Host
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                APK & ZIP Download Manager
              </p>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search APKs, ZIPs, package names..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded px-1.5 py-0.5"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center bg-slate-950 p-1 border border-slate-800 rounded-xl">
              <button
                onClick={() => onToggleViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onToggleViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="List View"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Storage Usage Button */}
            <button
              onClick={onOpenStorageStats}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors text-xs font-medium text-slate-300"
              title="Storage Analytics"
            >
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>{formatBytes(stats.totalBytes)}</span>
              <span className="text-slate-500">• {stats.totalCount} files</span>
            </button>

            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98] transition-all"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden xs:inline">Upload File</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
