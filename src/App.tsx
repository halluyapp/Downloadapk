import React, { useState, useEffect, useMemo } from 'react';
import { Category, FileType, HostedFile, StorageStats } from './types/file';
import {
  getAllFiles,
  saveHostedFile,
  deleteHostedFile,
  getDownloadUrl,
} from './services/storage';
import { filterAndSortFiles } from './utils/fileHelpers';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { FileCard } from './components/FileCard';
import { UploadModal } from './components/UploadModal';
import { FileDetailModal } from './components/FileDetailModal';
import { QRCodeModal } from './components/QRCodeModal';
import { StorageStatsModal } from './components/StorageStatsModal';
import { FolderSearch, Plus, CheckCircle, Smartphone } from 'lucide-react';

const CATEGORIES: Category[] = [
  'All',
  'Games',
  'Productivity',
  'Utilities',
  'Tools',
  'Media',
  'System',
  'Developer Kits',
];

export default function App() {
  const [files, setFiles] = useState<HostedFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & View State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedFileType, setSelectedFileType] = useState<FileType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'downloads' | 'size' | 'name' | 'rating'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [initialUploadFile, setInitialUploadFile] = useState<File | null>(null);
  const [selectedFileDetails, setSelectedFileDetails] = useState<HostedFile | null>(null);
  const [selectedFileQR, setSelectedFileQR] = useState<HostedFile | null>(null);
  const [isStorageStatsOpen, setIsStorageStatsOpen] = useState<boolean>(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load files from backend API
  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const data = await getAllFiles();
      setFiles(data);

      // Check URL params for direct download link or file details
      const params = new URLSearchParams(window.location.search);
      const downloadId = params.get('download');
      if (downloadId) {
        const found = data.find((f) => f.id === downloadId);
        if (found) {
          setSelectedFileDetails(found);
        }
      }
    } catch (err) {
      console.error('Failed to load file catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Derived Storage Statistics
  const stats: StorageStats = useMemo(() => {
    let totalBytes = 0;
    let apkBytes = 0;
    let zipBytes = 0;
    let otherBytes = 0;
    let apkCount = 0;
    let zipCount = 0;
    let totalDownloads = 0;

    for (const f of files) {
      totalBytes += f.fileSize;
      totalDownloads += f.downloadCount;
      if (f.fileType === 'apk' || f.fileType === 'xapk') {
        apkBytes += f.fileSize;
        apkCount++;
      } else if (f.fileType === 'zip') {
        zipBytes += f.fileSize;
        zipCount++;
      } else {
        otherBytes += f.fileSize;
      }
    }

    return {
      totalBytes,
      apkBytes,
      zipBytes,
      otherBytes,
      apkCount,
      zipCount,
      totalCount: files.length,
      totalDownloads,
    };
  }, [files]);

  // Filtered & Sorted File List
  const filteredFiles = useMemo(() => {
    return filterAndSortFiles(files, searchQuery, selectedCategory, selectedFileType, sortBy);
  }, [files, searchQuery, selectedCategory, selectedFileType, sortBy]);

  // Handle Drag Quick Upload trigger from Hero
  const handleQuickUpload = (file: File) => {
    setInitialUploadFile(file);
    setIsUploadOpen(true);
  };

  // Save uploaded file to Express server backend & state
  const handleSaveFile = async (newFileMeta: HostedFile, blob: Blob) => {
    try {
      const saved = await saveHostedFile(newFileMeta, blob);
      setFiles((prev) => [saved, ...prev]);
      showToast(`Successfully published ${saved.title} (v${saved.version}) to server`);
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Upload failed'}`);
    }
  };

  // Delete file handler
  const handleDeleteFile = async (targetFile: HostedFile) => {
    if (confirm(`Are you sure you want to delete "${targetFile.title}" from the server?`)) {
      const success = await deleteHostedFile(targetFile.id);
      if (success) {
        setFiles((prev) => prev.filter((f) => f.id !== targetFile.id));
        if (selectedFileDetails?.id === targetFile.id) setSelectedFileDetails(null);
        if (selectedFileQR?.id === targetFile.id) setSelectedFileQR(null);
        showToast(`Deleted ${targetFile.title} from server.`);
      } else {
        showToast(`Failed to delete ${targetFile.title}`);
      }
    }
  };

  // Download trigger streaming directly from backend server
  const handleDownload = async (file: HostedFile) => {
    showToast(`Downloading ${file.filename} from server...`);
    
    // Update local download count state
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, downloadCount: f.downloadCount + 1 } : f))
    );

    const downloadUrl = getDownloadUrl(file.id);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 border border-emerald-500/40 text-emerald-400 font-medium text-xs rounded-2xl shadow-2xl animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        stats={stats}
        onOpenUpload={() => {
          setInitialUploadFile(null);
          setIsUploadOpen(true);
        }}
        onOpenStorageStats={() => setIsStorageStatsOpen(true)}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Section with Quick Dropzone & Live Stats */}
      <HeroSection
        stats={stats}
        onQuickUpload={handleQuickUpload}
        onOpenUploadModal={() => {
          setInitialUploadFile(null);
          setIsUploadOpen(true);
        }}
      />

      {/* Filter and Controls Toolbar */}
      <FilterBar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedFileType={selectedFileType}
        onSelectFileType={setSelectedFileType}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
        totalCount={filteredFiles.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading hosted repository files from Express server...</p>
          </div>
        ) : filteredFiles.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                : 'space-y-3'
            }
          >
            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                viewMode={viewMode}
                onDownload={handleDownload}
                onOpenQR={(f) => setSelectedFileQR(f)}
                onOpenDetails={(f) => setSelectedFileDetails(f)}
                onDelete={handleDeleteFile}
              />
            ))}
          </div>
        ) : (
          /* Empty Search or Filter State */
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
              <FolderSearch className="w-8 h-8 text-slate-500" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No files found</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No APKs or ZIP files match your search or category filter.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedFileType('all');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Reset Filters
              </button>

              <button
                onClick={() => {
                  setInitialUploadFile(null);
                  setIsUploadOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New File</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">APKVault</span>
            <span>— Centralized APK & ZIP File Hosting Engine</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Server Direct Streaming</span>
            <span>•</span>
            <span>QR Mobile Sync</span>
            <span>•</span>
            <span>Checksum Verified</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setInitialUploadFile(null);
        }}
        onSaveFile={handleSaveFile}
        initialFile={initialUploadFile}
      />

      <FileDetailModal
        file={selectedFileDetails}
        onClose={() => setSelectedFileDetails(null)}
        onDownload={handleDownload}
        onOpenQR={(f) => {
          setSelectedFileDetails(null);
          setSelectedFileQR(f);
        }}
      />

      <QRCodeModal
        file={selectedFileQR}
        onClose={() => setSelectedFileQR(null)}
        onDownload={handleDownload}
      />

      <StorageStatsModal
        isOpen={isStorageStatsOpen}
        stats={stats}
        onClose={() => setIsStorageStatsOpen(false)}
      />

    </div>
  );
}
