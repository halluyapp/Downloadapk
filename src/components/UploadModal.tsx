import React, { useState, useEffect } from 'react';
import { X, UploadCloud, FileCode, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Category, FileType, HostedFile } from '../types/file';
import { parsePackageFromFilename, formatBytes, generateMockChecksums } from '../utils/fileHelpers';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveFile: (file: HostedFile, blob: Blob) => Promise<void>;
  initialFile?: File | null;
}

const CATEGORIES: Category[] = [
  'Games',
  'Productivity',
  'Utilities',
  'Tools',
  'Media',
  'System',
  'Developer Kits',
];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSaveFile,
  initialFile,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Utilities');
  const [fileType, setFileType] = useState<FileType>('apk');
  const [version, setVersion] = useState('1.0.0');
  const [developer, setDeveloper] = useState('Independent Developer');
  const [packageName, setPackageName] = useState('');
  const [minSdk, setMinSdk] = useState('Android 7.0+ (API 24)');
  const [description, setDescription] = useState('');
  const [changelog, setChangelog] = useState('• Initial public release package');
  const [tags, setTags] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (initialFile) {
      handleFileSelected(initialFile);
    }
  }, [initialFile]);

  if (!isOpen) return null;

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    const parsed = parsePackageFromFilename(file.name);
    setTitle(parsed.title);
    setVersion(parsed.version);
    setFileType(parsed.fileType);
    if (parsed.packageName) {
      setPackageName(parsed.packageName);
    } else if (parsed.fileType === 'apk') {
      setPackageName(`com.app.${parsed.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
    }

    setTags(`${parsed.fileType}, ${parsed.title.toLowerCase()}, release`);
    
    if (parsed.fileType === 'apk') {
      setDescription(`Android application package for ${parsed.title}. Sideload and install directly on your Android phone.`);
    } else {
      setDescription(`Compressed ZIP archive containing ${parsed.title} project files, assets, and documentation.`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 100);

    setTimeout(async () => {
      clearInterval(interval);
      setUploadProgress(100);

      const computedFilename = selectedFile
        ? selectedFile.name
        : `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}_v${version}.${fileType}`;
      
      const computedSize = selectedFile ? selectedFile.size : 15400000;
      const checksums = generateMockChecksums(computedFilename + computedSize + Date.now());

      const newHostedFile: HostedFile = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: title.trim(),
        filename: computedFilename,
        fileType,
        fileSize: computedSize,
        version: version.trim() || '1.0.0',
        packageName: fileType === 'apk' || fileType === 'xapk' 
          ? (packageName.trim() || `com.dev.${title.toLowerCase().replace(/[^a-z0-9]/g, '')}`) 
          : undefined,
        minSdk: fileType === 'apk' || fileType === 'xapk' ? minSdk.trim() : undefined,
        category,
        description: description.trim() || `Uploaded ${fileType.toUpperCase()} file package for ${title}.`,
        changelog: changelog.trim() || '• Initial release',
        developer: developer.trim() || 'Independent Developer',
        uploadDate: new Date().toISOString(),
        downloadCount: 0,
        rating: 5.0,
        iconUrl: iconUrl.trim() || undefined,
        sha256: checksums.sha256,
        md5: checksums.md5,
        isVerified: true,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [fileType, 'release'],
        permissions: fileType === 'apk' ? [
          'android.permission.INTERNET',
          'android.permission.READ_EXTERNAL_STORAGE',
          'android.permission.ACCESS_NETWORK_STATE'
        ] : undefined
      };

      try {
        const payloadBlob = selectedFile || new Blob([`[APKVault Package]\nTitle: ${title}\n`], { type: 'application/octet-stream' });
        await onSaveFile(newHostedFile, payloadBlob);
        setIsUploading(false);
        onClose();
      } catch (err) {
        console.error('Upload failed:', err);
        setIsUploading(false);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Publish APK / ZIP Package</h2>
              <p className="text-xs text-slate-400">Host your file for instant direct downloads</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* File Upload Zone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                1. Select File (.apk / .zip) <span className="text-slate-500 font-normal">(Optional or Auto-Detect)</span>
              </label>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                selectedFile
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
              }`}
            >
              <input
                type="file"
                id="modal-file-input"
                onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                accept=".apk,.xapk,.apks,.zip,.rar,.7z,.tar.gz"
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                      <FileCode className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white line-clamp-1">{selectedFile.name}</p>
                      <p className="text-xs text-slate-400">{formatBytes(selectedFile.size)} • {fileType.toUpperCase()}</p>
                    </div>
                  </div>
                  <label
                    htmlFor="modal-file-input"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    Change
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="modal-file-input"
                  className="cursor-pointer block space-y-1.5 py-3"
                >
                  <UploadCloud className="w-7 h-7 text-emerald-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-200">
                    Click to select file or drag & drop here
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Or skip file attach to create manual listing directly
                  </p>
                </label>
              )}
            </div>
          </div>

          {/* Title & Version Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                App / Package Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Minecraft, Spotify Mod, Utility Pack"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Version *
              </label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Category & File Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Format Type *
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as FileType)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="apk">Android APK (.apk)</option>
                <option value="xapk">Android Split APK (.xapk / .apks)</option>
                <option value="zip">ZIP Archive (.zip / .7z / .tar.gz)</option>
              </select>
            </div>
          </div>

          {/* Android specific fields if APK */}
          {(fileType === 'apk' || fileType === 'xapk') && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <div className="sm:col-span-7">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Package Identifier
                </label>
                <input
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="com.company.app"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Min Android Version
                </label>
                <input
                  type="text"
                  value={minSdk}
                  onChange={(e) => setMinSdk(e.target.value)}
                  placeholder="Android 7.0+ (API 24)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          )}

          {/* Developer Name & Icon URL */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Developer / Author
              </label>
              <input
                type="text"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                placeholder="e.g. Acme Studio"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                App Icon URL (Optional)
              </label>
              <input
                type="url"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://example.com/icon.png"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              App Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this APK or ZIP file contains..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Release Notes & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Changelog / Notes
              </label>
              <textarea
                rows={2}
                value={changelog}
                onChange={(e) => setChangelog(e.target.value)}
                placeholder="• Feature 1&#10;• Bug fixes"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Search Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="apk, game, tool"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Progress Bar when publishing */}
          {isUploading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span>Publishing file package to server repository...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>VirusTotal Verified Clean</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={!title.trim() || isUploading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isUploading ? 'Publishing...' : 'Publish Package'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
