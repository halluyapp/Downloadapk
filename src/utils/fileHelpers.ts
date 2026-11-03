import { Category, FileType, HostedFile } from '../types/file';

/**
 * Formats file size in bytes to human-readable string (KB, MB, GB).
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Detects file type from filename extension.
 */
export function detectFileType(filename: string): FileType {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (ext === 'apk') return 'apk';
  if (ext === 'xapk' || ext === 'apks') return 'xapk';
  if (ext === 'zip' || ext === 'rar' || ext === '7z' || ext === 'tar' || ext === 'gz') return 'zip';
  return 'other';
}

/**
 * Deterministically generates mock SHA-256 and MD5 hashes based on string seed.
 */
export function generateMockChecksums(seed: string): { sha256: string; md5: string } {
  let hash1 = 0;
  let hash2 = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash1 = (hash1 << 5) - hash1 + char;
    hash1 |= 0;
    hash2 = (hash2 << 7) - hash2 + char * 31;
    hash2 |= 0;
  }

  const hex1 = Math.abs(hash1).toString(16).padStart(8, '0');
  const hex2 = Math.abs(hash2).toString(16).padStart(8, '0');

  const md5 = (hex1 + hex2 + hex1 + hex2).substring(0, 32);
  const sha256 = (hex2 + hex1 + hex2 + hex1 + hex1 + hex2 + hex1 + hex2).substring(0, 64);

  return { sha256, md5 };
}

/**
 * Intelligent parser to infer title, version, and package name from uploaded filename.
 */
export function parsePackageFromFilename(filename: string): {
  title: string;
  version: string;
  packageName: string;
  fileType: FileType;
} {
  const fileType = detectFileType(filename);
  const baseName = filename.replace(/\.(apk|xapk|apks|zip|rar|7z|tar\.gz)$/i, '');

  let version = '1.0.0';

  // Extract version matching like v1.2.3 or _1.2.3 or -1.2.3
  const versionMatch = baseName.match(/(?:[v_\-s])?(\d+\.\d+(?:\.\d+)?(?:-[a-zA-Z0-9]+)?)/);
  if (versionMatch) {
    version = versionMatch[1];
  }

  // Isolate name part before version string and trim trailing separators
  const rawNamePart = baseName.split(/(?:[_\-v])\d+\.\d+/i)[0] || baseName;
  const namePart = rawNamePart.replace(/[\_\-\.]+$|^v/gi, '');

  // Check if filename contains a Java-style package pattern (com.example.app)
  const packageMatch = namePart.match(/^([a-z][a-z0-9_]*(?:\.[a-z0-9_]+)+)/i);
  let packageName = '';
  let title = '';

  if (packageMatch) {
    packageName = packageMatch[1].toLowerCase();
    const parts = packageName.split('.');
    const appPart = parts[parts.length - 1];
    title = appPart.charAt(0).toUpperCase() + appPart.slice(1);
  } else {
    // Clean up title from baseName
    title = namePart
      .replace(/[_\-]/g, ' ')
      .trim();
    if (!title) title = baseName;
    title = title
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  return { title, version, packageName, fileType };
}

/**
 * Filter and sort files helper.
 */
export function filterAndSortFiles(
  files: HostedFile[],
  searchQuery: string,
  selectedCategory: Category | 'All',
  selectedFileType: FileType | 'all',
  sortBy: 'newest' | 'downloads' | 'size' | 'name' | 'rating'
): HostedFile[] {
  return files
    .filter((file) => {
      // Category filter
      if (selectedCategory !== 'All' && file.category !== selectedCategory) {
        return false;
      }
      // File type filter
      if (selectedFileType !== 'all' && file.fileType !== selectedFileType) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = file.title.toLowerCase().includes(query);
        const matchesFilename = file.filename.toLowerCase().includes(query);
        const matchesPackage = file.packageName?.toLowerCase().includes(query) || false;
        const matchesDeveloper = file.developer.toLowerCase().includes(query);
        const matchesTags = file.tags.some((t) => t.toLowerCase().includes(query));
        const matchesDesc = file.description.toLowerCase().includes(query);

        return matchesTitle || matchesFilename || matchesPackage || matchesDeveloper || matchesTags || matchesDesc;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
      if (sortBy === 'downloads') {
        return b.downloadCount - a.downloadCount;
      }
      if (sortBy === 'size') {
        return b.fileSize - a.fileSize;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
}
