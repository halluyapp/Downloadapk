import { HostedFile, StorageStats } from '../types/file';

/**
 * Fetch all hosted files from Express server backend
 */
export async function getAllFiles(): Promise<HostedFile[]> {
  try {
    const response = await fetch('/api/files');
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const files: HostedFile[] = await response.json();
    return files;
  } catch (err) {
    console.error('Error fetching files from server backend:', err);
    return [];
  }
}

/**
 * Upload a new APK or ZIP file to the Express server backend
 */
export async function saveHostedFile(fileMeta: HostedFile, fileBlob?: Blob | File): Promise<HostedFile> {
  const formData = new FormData();
  
  if (fileBlob) {
    if (fileBlob instanceof File) {
      formData.append('file', fileBlob, fileBlob.name);
    } else {
      formData.append('file', fileBlob, fileMeta.filename);
    }
  }

  formData.append('title', fileMeta.title);
  formData.append('filename', fileMeta.filename);
  formData.append('fileType', fileMeta.fileType);
  formData.append('fileSize', fileMeta.fileSize.toString());
  formData.append('version', fileMeta.version);
  if (fileMeta.packageName) formData.append('packageName', fileMeta.packageName);
  if (fileMeta.minSdk) formData.append('minSdk', fileMeta.minSdk);
  formData.append('category', fileMeta.category);
  formData.append('description', fileMeta.description);
  if (fileMeta.changelog) formData.append('changelog', fileMeta.changelog);
  formData.append('developer', fileMeta.developer);
  if (fileMeta.iconUrl) formData.append('iconUrl', fileMeta.iconUrl);
  if (fileMeta.tags) formData.append('tags', fileMeta.tags.join(','));

  const response = await fetch('/api/files/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload file to backend server');
  }

  const savedFile: HostedFile = await response.json();
  return savedFile;
}

/**
 * Delete hosted file from Express server backend
 */
export async function deleteHostedFile(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/files/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (err) {
    console.error('Error deleting file from backend:', err);
    return false;
  }
}

/**
 * Trigger backend download and return URL
 */
export function getDownloadUrl(id: string): string {
  return `/api/files/download/${id}`;
}

export async function incrementDownloadCount(id: string): Promise<number> {
  // Handled automatically on the server during GET /api/files/download/:id
  return 1;
}

export async function getStorageStats(files: HostedFile[]): Promise<StorageStats> {
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
}
