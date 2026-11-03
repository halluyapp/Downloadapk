import React, { useRef, useState } from 'react';
import { UploadCloud, Smartphone, Archive, ShieldCheck, Download, Sparkles, FileCode } from 'lucide-react';
import { StorageStats } from '../types/file';
import { formatBytes } from '../utils/fileHelpers';

interface HeroSectionProps {
  stats: StorageStats;
  onQuickUpload: (file: File) => void;
  onOpenUploadModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  onQuickUpload,
  onOpenUploadModal,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      onQuickUpload(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onQuickUpload(e.target.files[0]);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/60 pb-8 pt-6">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Manual Upload & High-Speed Direct Downloads</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Host Your <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">APKs & ZIP Files</span> Instantly
            </h1>

            <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Upload Android package files (.apk, .xapk) and archive bundles (.zip, .7z) directly to your secure browser repository. Generate mobile QR codes, inspect package checksums, and share direct download links.
            </p>

            {/* Live Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase text-slate-400">APKs</span>
                </div>
                <div className="text-xl font-bold text-white">{stats.apkCount}</div>
                <div className="text-[11px] text-slate-500">{formatBytes(stats.apkBytes)}</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                  <Archive className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase text-slate-400">ZIP Archives</span>
                </div>
                <div className="text-xl font-bold text-white">{stats.zipCount}</div>
                <div className="text-[11px] text-slate-500">{formatBytes(stats.zipBytes)}</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <Download className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase text-slate-400">Downloads</span>
                </div>
                <div className="text-xl font-bold text-white">{stats.totalDownloads.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500">Across all files</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-teal-400 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase text-slate-400">Security</span>
                </div>
                <div className="text-xl font-bold text-emerald-400">100%</div>
                <div className="text-[11px] text-slate-500">Checksum Verified</div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Drag & Drop Upload Zone */}
          <div className="lg:col-span-5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".apk,.xapk,.apks,.zip,.rar,.7z,.tar.gz"
              className="hidden"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-200 ${
                isDragging
                  ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02]'
                  : 'border-slate-800 hover:border-emerald-500/50 bg-slate-900/60 hover:bg-slate-900/90'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                Drag & Drop <span className="text-emerald-400">APK</span> or <span className="text-cyan-400">ZIP</span> File
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Or click to browse your computer files (.apk, .xapk, .zip, .7z)
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition-colors">
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Manual File Upload</span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Max size: Unlimited (Local DB)</span>
                <span>Auto package inspection</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
