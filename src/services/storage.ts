import { HostedFile, StorageStats } from '../types/file';
import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  increment,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';

const COLLECTION_NAME = 'files';
const CHUNK_SIZE = 450000; // 450KB per chunk (well under 1MB Firestore doc limit)

/**
 * Subscribe to real-time Cloud Firestore updates across all devices
 */
export function subscribeToFiles(callback: (files: HostedFile[]) => void): () => void {
  const colRef = collection(db, COLLECTION_NAME);
  
  return onSnapshot(colRef, (snapshot) => {
    const files: HostedFile[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as HostedFile;
      return {
        ...data,
        id: docSnap.id,
      };
    });

    // Sort by newest upload date
    files.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

    callback(files);
  }, (err) => {
    console.error('Firestore subscription error:', err);
    callback([]);
  });
}

/**
 * Convert a File or Blob into Base64 Data URL string
 */
function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Convert a Base64 string back into a downloadable Blob
 */
export function base64ToBlob(base64Data: string, fallbackType = 'application/octet-stream'): Blob {
  try {
    const parts = base64Data.split(';base64,');
    const mimeType = parts.length > 1 ? parts[0].replace('data:', '') : fallbackType;
    const raw = atob(parts.length > 1 ? parts[1] : parts[0]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: mimeType });
  } catch (err) {
    console.error('Error converting base64 to blob:', err);
    return new Blob(['Corrupted file payload'], { type: fallbackType });
  }
}

/**
 * Upload a real APK or ZIP file to Cloud Firestore (chunked binary storage)
 */
export async function saveHostedFile(fileMeta: HostedFile, realFile: File | Blob): Promise<HostedFile> {
  const fileId = fileMeta.id || `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const base64Content = await fileToBase64(realFile);

  // Divide base64 content into chunks
  const chunks: string[] = [];
  for (let i = 0; i < base64Content.length; i += CHUNK_SIZE) {
    chunks.push(base64Content.substring(i, i + CHUNK_SIZE));
  }

  // Save main metadata doc
  const mainDocRef = doc(db, COLLECTION_NAME, fileId);
  const metadataToSave: Record<string, any> = {
    ...fileMeta,
    id: fileId,
    totalChunks: chunks.length,
    downloadCount: fileMeta.downloadCount || 0,
    uploadDate: fileMeta.uploadDate || new Date().toISOString(),
  };

  // Remove undefined fields
  Object.keys(metadataToSave).forEach((k) => {
    if (metadataToSave[k] === undefined) delete metadataToSave[k];
  });

  await setDoc(mainDocRef, metadataToSave);

  // Save chunks in subcollection
  const chunksColRef = collection(db, COLLECTION_NAME, fileId, 'chunks');
  for (let i = 0; i < chunks.length; i++) {
    const chunkDocRef = doc(chunksColRef, `chunk_${i}`);
    await setDoc(chunkDocRef, {
      index: i,
      data: chunks[i],
    });
  }

  return { ...fileMeta, id: fileId };
}

/**
 * Download the real binary file from Cloud Firestore across any device or phone
 */
export async function downloadRealFileFromCloud(fileId: string, filename: string, fileType: string): Promise<Blob> {
  const chunksColRef = collection(db, COLLECTION_NAME, fileId, 'chunks');
  const snapshot = await getDocs(chunksColRef);

  if (snapshot.empty) {
    throw new Error('File data chunks not found on cloud server.');
  }

  const sortedDocs = snapshot.docs.sort((a, b) => {
    const idxA = a.data().index ?? 0;
    const idxB = b.data().index ?? 0;
    return idxA - idxB;
  });

  const fullBase64 = sortedDocs.map((docSnap) => docSnap.data().data).join('');
  const mimeType = fileType === 'zip' ? 'application/zip' : 'application/vnd.android.package-archive';

  return base64ToBlob(fullBase64, mimeType);
}

/**
 * Delete file and all its chunks from Cloud Firestore
 */
export async function deleteHostedFile(id: string): Promise<boolean> {
  try {
    // Delete chunks
    const chunksColRef = collection(db, COLLECTION_NAME, id, 'chunks');
    const chunksSnap = await getDocs(chunksColRef);
    const batch = writeBatch(db);
    
    chunksSnap.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });

    // Delete main document
    const mainDocRef = doc(db, COLLECTION_NAME, id);
    batch.delete(mainDocRef);

    await batch.commit();
    return true;
  } catch (err) {
    console.error('Error deleting file from Firestore:', err);
    return false;
  }
}

/**
 * Increment download count in Cloud Firestore
 */
export async function incrementDownloadCount(id: string): Promise<number> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      downloadCount: increment(1),
    });
  } catch (err) {
    console.warn('Error incrementing download count:', err);
  }
  return 1;
}

export function getDownloadUrl(id: string): string {
  return `?download=${id}`;
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
