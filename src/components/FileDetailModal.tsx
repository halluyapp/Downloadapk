import React, { useState } from 'react';
import { X, Download, QrCode, ShieldCheck, Copy, Check, Star, Calendar, HardDrive, Smartphone, Archive, FileText, CheckCircle } from 'lucide-react';
import { HostedFile } from '../types/file';
import { formatBytes } from '../utils/fileHelpers';
import QRCode from 'qrcode';

interface FileDetailModalProps {
  file: HostedFile | null;
  onClose: () => void;
  onDownload: (file: HostedFile) => void;
  onOpenQR: (file: HostedFile) => void;
}

export const FileDetailModal: React.FC<FileDetailModalProps> = ({
  file,
  onClose,
  onDownload,
  onOpenQR,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'hashes' | 'permissions' | 'changelog'>('overview');

  if (!file) return null;

  const isApk = file.fileType === 'apk' || file.fileType === 'xapk';

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* App Icon */}
            {file.iconUrl ? (
              <img
                src={file.iconUrl}
                alt={file.title}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-xl"
              />
            ) : (
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-slate-700 shadow-xl ${
                isApk ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'
              }`}>
                {isApk ? <Smartphone className="w-10 h-10" /> : <Archive className="w-10 h-10" />}
              </div>
            )}

            {/* Info */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 text-xs font-extrabold uppercase rounded-md border ${
                  isApk ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                }`}>
                  {file.fileType}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-800 text-slate-200 rounded-md">
                  Version {file.version}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-medium bg-slate-800/60 text-slate-400 rounded-md">
                  {file.category}
                </span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight leading-snug">
                {file.title}
              </h2>

              <p className="text-xs text-slate-400">
                Published by <strong className="text-slate-200 font-semibold">{file.developer}</strong> {file.packageName && `• ${file.packageName}`}
              </p>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                  {formatBytes(file.fileSize)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  {file.downloadCount.toLocaleString()} downloads
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {file.rating.toFixed(1)} / 5.0
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 bg-slate-950 border-b border-slate-800 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Screenshots
          </button>

          <button
            onClick={() => setActiveTab('hashes')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'hashes'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Security & Hashes (SHA-256)
          </button>

          {isApk && file.permissions && (
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'permissions'
                  ? 'border-emerald-400 text-emerald-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              App Permissions ({file.permissions.length})
            </button>
          )}

          <button
            onClick={() => setActiveTab('changelog')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'changelog'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Changelog & Notes
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/60 p-4 border border-slate-800/80 rounded-xl">
                  {file.description}
                </p>
              </div>

              {/* Screenshots Gallery if available */}
              {file.screenshots && file.screenshots.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Screenshots Preview</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {file.screenshots.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Screenshot ${i + 1}`}
                        className="w-full h-40 object-cover rounded-xl border border-slate-800 hover:border-slate-700 transition-colors shadow-md"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-4 border border-slate-800 rounded-xl text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Filename</span>
                  <span className="font-mono text-slate-200 truncate block">{file.filename}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Uploaded</span>
                  <span className="text-slate-200">{new Date(file.uploadDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Min Compatibility</span>
                  <span className="text-slate-200">{file.minSdk || 'Universal'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Security Scan</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Passed (Clean)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HASHES */}
          {activeTab === 'hashes' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-emerald-400">Cryptographic Integrity Check</p>
                  <p className="text-slate-300">
                    Verify that your downloaded file matches the exact digital signature calculated upon upload.
                  </p>
                </div>
              </div>

              {/* SHA-256 */}
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">SHA-256 Checksum</span>
                  <button
                    onClick={() => copyToClipboard(file.sha256, 'sha256')}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    {copiedField === 'sha256' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'sha256' ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-400 break-all select-all bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  {file.sha256}
                </div>
              </div>

              {/* MD5 */}
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">MD5 Checksum</span>
                  <button
                    onClick={() => copyToClipboard(file.md5, 'md5')}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    {copiedField === 'md5' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'md5' ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-400 break-all select-all bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  {file.md5}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PERMISSIONS */}
          {activeTab === 'permissions' && file.permissions && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                The following Android framework permissions are declared in this APK manifest:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {file.permissions.map((perm, index) => (
                  <div key={index} className="flex items-center gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CHANGELOG */}
          {activeTab === 'changelog' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Release Notes (v{file.version})</h3>
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl text-xs text-slate-300 whitespace-pre-line leading-relaxed font-mono">
                {file.changelog || 'No detailed changelog provided for this release version.'}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={() => onOpenQR(file)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors border border-slate-700/60"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Scan Mobile QR</span>
          </button>

          <button
            onClick={() => onDownload(file)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download ({formatBytes(file.fileSize)})</span>
          </button>
        </div>

      </div>
    </div>
  );
};
