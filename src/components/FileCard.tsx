import React from 'react';
import { Download, QrCode, ShieldCheck, Star, Trash2, Smartphone, Archive, FileCode, Check } from 'lucide-react';
import { HostedFile } from '../types/file';
import { formatBytes } from '../utils/fileHelpers';

interface FileCardProps {
  file: HostedFile;
  viewMode: 'grid' | 'list';
  onDownload: (file: HostedFile) => void;
  onOpenQR: (file: HostedFile) => void;
  onOpenDetails: (file: HostedFile) => void;
  onDelete: (file: HostedFile) => void;
}

export const FileCard: React.FC<FileCardProps> = ({
  file,
  viewMode,
  onDownload,
  onOpenQR,
  onOpenDetails,
  onDelete,
}) => {
  const isApk = file.fileType === 'apk' || file.fileType === 'xapk';
  const isZip = file.fileType === 'zip';

  // File type styling
  const typeBadgeClass = isApk
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    : isZip
    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    : 'bg-purple-500/10 text-purple-400 border-purple-500/30';

  const defaultIconBg = file.iconBgColor || (isApk ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400');

  if (viewMode === 'list') {
    return (
      <div className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left info block */}
        <div className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer" onClick={() => onOpenDetails(file)}>
          {/* App Icon or File Type Badge */}
          <div className="relative shrink-0">
            {file.iconUrl ? (
              <img
                src={file.iconUrl}
                alt={file.title}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700/80 shadow-md group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-slate-700/80 ${defaultIconBg}`}>
                {isApk ? <Smartphone className="w-6 h-6" /> : <Archive className="w-6 h-6" />}
              </div>
            )}
            {file.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full ring-2 ring-slate-900" title="Verified Clean">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-white text-base truncate group-hover:text-emerald-400 transition-colors">
                {file.title}
              </h3>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${typeBadgeClass}`}>
                {file.fileType}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 text-slate-300 rounded">
                v{file.version}
              </span>
            </div>

            <p className="text-xs text-slate-400 truncate mb-1">
              {file.developer} • {file.category} {file.packageName && `• ${file.packageName}`}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>{formatBytes(file.fileSize)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3 text-slate-400" />
                {file.downloadCount.toLocaleString()} downloads
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                {file.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
          <button
            onClick={() => onOpenQR(file)}
            className="p-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/60 transition-colors"
            title="Scan Phone QR Code"
            aria-label="Scan Phone QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(file)}
            className="p-2.5 bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700/60 hover:border-rose-500/30 transition-colors"
            title="Delete File"
            aria-label="Delete File"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDownload(file)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    );
  }

  // Grid Card View
  return (
    <div className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/5 relative overflow-hidden">
      
      {/* Top Banner accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isApk ? 'bg-emerald-500/80' : 'bg-cyan-500/80'}`} />

      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          
          <div className="relative cursor-pointer" onClick={() => onOpenDetails(file)}>
            {file.iconUrl ? (
              <img
                src={file.iconUrl}
                alt={file.title}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-700/80 shadow-lg group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-700/80 ${defaultIconBg}`}>
                {isApk ? <Smartphone className="w-7 h-7" /> : <Archive className="w-7 h-7" />}
              </div>
            )}
            {file.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full ring-2 ring-slate-900" title="Verified Clean">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${typeBadgeClass}`}>
              {file.fileType}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded border border-slate-700/60">
              v{file.version}
            </span>
          </div>

        </div>

        {/* Title & Developer */}
        <div className="cursor-pointer mb-3" onClick={() => onOpenDetails(file)}>
          <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors line-clamp-1 mb-0.5">
            {file.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1">
            {file.developer}
          </p>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-400/90 line-clamp-2 mb-4 leading-relaxed">
          {file.description}
        </p>

        {/* Specs Badges */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 mb-4">
          <div className="flex items-center gap-1">
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-300">{formatBytes(file.fileSize)}</span>
          </div>

          <div className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{file.downloadCount.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{file.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        <button
          onClick={() => onOpenQR(file)}
          className="col-span-1 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/60 transition-colors flex items-center justify-center"
          title="Scan QR Code for Phone Download"
          aria-label="Scan QR Code"
        >
          <QrCode className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete(file)}
          className="col-span-1 py-2 bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700/60 hover:border-rose-500/30 transition-colors flex items-center justify-center"
          title="Delete File"
          aria-label="Delete File"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDownload(file)}
          className="col-span-2 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>

    </div>
  );
};
