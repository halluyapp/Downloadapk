export type FileType = 'apk' | 'zip' | 'xapk' | 'other';

export type Category = 
  | 'All'
  | 'Games'
  | 'Productivity'
  | 'Utilities'
  | 'Tools'
  | 'Media'
  | 'System'
  | 'Developer Kits';

export interface HostedFile {
  id: string;
  title: string;
  filename: string;
  fileType: FileType;
  fileSize: number; // in bytes
  version: string;
  packageName?: string;
  minSdk?: string;
  category: Category;
  description: string;
  changelog?: string;
  developer: string;
  uploadDate: string; // ISO string
  downloadCount: number;
  rating: number; // 1 to 5
  iconUrl?: string;
  iconBgColor?: string;
  screenshots?: string[];
  sha256: string;
  md5: string;
  isVerified: boolean;
  tags: string[];
  downloadUrl?: string; // Blob URL or static URL
  blobData?: Blob; // Stored binary payload
  permissions?: string[];
}

export interface UploadFormData {
  title: string;
  file: File | null;
  category: Category;
  version: string;
  developer: string;
  description: string;
  changelog: string;
  minSdk: string;
  packageName: string;
  tags: string;
  iconUrl?: string;
}

export interface StorageStats {
  totalBytes: number;
  apkBytes: number;
  zipBytes: number;
  otherBytes: number;
  apkCount: number;
  zipCount: number;
  totalCount: number;
  totalDownloads: number;
}
