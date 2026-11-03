import React from 'react';
import { Category, FileType } from '../types/file';
import { Filter, ArrowUpDown, Smartphone, Archive, Layers } from 'lucide-react';

interface FilterBarProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  selectedFileType: FileType | 'all';
  onSelectFileType: (ft: FileType | 'all') => void;
  sortBy: 'newest' | 'downloads' | 'size' | 'name' | 'rating';
  onSelectSortBy: (sort: 'newest' | 'downloads' | 'size' | 'name' | 'rating') => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedFileType,
  onSelectFileType,
  sortBy,
  onSelectSortBy,
  totalCount,
}) => {
  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 py-4 sticky top-16 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Top Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* File Type Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => onSelectFileType('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedFileType === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Files</span>
            </button>

            <button
              onClick={() => onSelectFileType('apk')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedFileType === 'apk'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>APKs</span>
            </button>

            <button
              onClick={() => onSelectFileType('zip')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedFileType === 'zip'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Archive className="w-3.5 h-3.5 text-cyan-400" />
              <span>ZIPs</span>
            </button>
          </div>

          {/* Right Controls: Sort & Count */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Showing <strong className="text-white">{totalCount}</strong> files
            </span>

            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-xl text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => onSelectSortBy(e.target.value as any)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-slate-900 text-slate-200">Newest First</option>
                <option value="downloads" className="bg-slate-900 text-slate-200">Most Downloaded</option>
                <option value="rating" className="bg-slate-900 text-slate-200">Top Rated</option>
                <option value="size" className="bg-slate-900 text-slate-200">File Size</option>
                <option value="name" className="bg-slate-900 text-slate-200">Alphabetical</option>
              </select>
            </div>
          </div>

        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase text-[10px] tracking-wider shrink-0 mr-1">
            <Filter className="w-3 h-3" />
            <span>Categories:</span>
          </div>

          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-slate-100 text-slate-950 border-slate-100 font-bold shadow'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800/80 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
