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
} from 'firebase/firestore';

const COLLECTION_NAME = 'files';

// Initial default seed items if cloud database is empty on first boot
const SEED_FILES: HostedFile[] = [
  {
    id: 'seed-vlc-apk',
    title: 'VLC Media Player',
    filename: 'org.videolan.vlc_v3.5.4.apk',
    fileType: 'apk',
    fileSize: 34857600,
    version: '3.5.4',
    packageName: 'org.videolan.vlc',
    minSdk: 'Android 6.0+ (API 23)',
    category: 'Media',
    description: 'VLC for Android is a full audio & video player that plays local video and audio files, as well as network streams. Includes subtitle support and equalizers.',
    changelog: '• Added support for AV1 video codec playback\n• Improved SMB v3 network shares browsing\n• Redesigned audio player interface',
    developer: 'VideoLAN Organization',
    uploadDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    downloadCount: 14280,
    rating: 4.9,
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    iconBgColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    md5: '5d41402abc4b2a76b9719d911017c592',
    isVerified: true,
    tags: ['video', 'audio', 'player', 'media', 'open-source', 'streaming'],
    permissions: [
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.INTERNET',
      'android.permission.FOREGROUND_SERVICE'
    ]
  },
  {
    id: 'seed-newpipe-apk',
    title: 'NewPipe Lightweight Player',
    filename: 'org.schabi.newpipe_v0.27.0.apk',
    fileType: 'apk',
    fileSize: 15420000,
    version: '0.27.0',
    packageName: 'org.schabi.newpipe',
    minSdk: 'Android 5.0+ (API 21)',
    category: 'Media',
    description: 'A privacy-friendly, lightweight video streaming frontend for Android without Google Play Services.',
    changelog: '• Upgraded video stream parser for higher 4K 60fps stability\n• Added sponsor block integration toggle',
    developer: 'Team NewPipe',
    uploadDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    downloadCount: 9850,
    rating: 4.8,
    iconUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150&auto=format&fit=crop&q=80',
    iconBgColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    sha256: '7a88d123884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    md5: '3e41402abc4b2a76b9719d911017c592',
    isVerified: true,
    tags: ['streaming', 'youtube', 'privacy', 'lightweight'],
    permissions: [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE'
    ]
  },
  {
    id: 'seed-fdroid-apk',
    title: 'F-Droid App Store',
    filename: 'org.fdroid.fdroid_v1.19.0.apk',
    fileType: 'apk',
    fileSize: 11200000,
    version: '1.19.0',
    packageName: 'org.fdroid.fdroid',
    minSdk: 'Android 5.0+ (API 21)',
    category: 'Utilities',
    description: 'F-Droid is an installable catalog of FOSS (Free and Open Source Software) applications for the Android platform.',
    changelog: '• Added automatic background repository index sync\n• Support for unattended app updates',
    developer: 'F-Droid Project',
    uploadDate: new Date(Date.now() - 86400000 * 12).toISOString(),
    downloadCount: 21400,
    rating: 4.9,
    iconUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80',
    iconBgColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    sha256: '5b88d123884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    md5: '2a41402abc4b2a76b9719d911017c592',
    isVerified: true,
    tags: ['appstore', 'foss', 'open-source', 'utilities'],
    permissions: [
      'android.permission.REQUEST_INSTALL_PACKAGES',
      'android.permission.INTERNET'
    ]
  },
  {
    id: 'seed-retroarch-apk',
    title: 'RetroArch Gaming Hub',
    filename: 'com.retroarch.aarch64_v1.17.0.apk',
    fileType: 'apk',
    fileSize: 184500000,
    version: '1.17.0',
    packageName: 'com.retroarch.aarch64',
    minSdk: 'Android 8.0+ (API 26)',
    category: 'Games',
    description: 'RetroArch is an open-source modular cross-platform emulation engine.',
    changelog: '• Updated Vulkan 1.3 rendering driver\n• Added touch gesture custom overlay layout editor',
    developer: 'Libretro Team',
    uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    downloadCount: 16700,
    rating: 4.7,
    iconUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80',
    iconBgColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    sha256: '1a88d123884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    md5: '1e41402abc4b2a76b9719d911017c592',
    isVerified: true,
    tags: ['games', 'emulator', 'retro', 'libretro'],
    permissions: [
      'android.permission.MANAGE_EXTERNAL_STORAGE',
      'android.permission.BLUETOOTH_CONNECT'
    ]
  },
  {
    id: 'seed-dev-tools-zip',
    title: 'ADB & Fastboot Platform Tools',
    filename: 'android-developer-platform-tools-r35.0.1.zip',
    fileType: 'zip',
    fileSize: 18900000,
    version: '35.0.1',
    category: 'Developer Kits',
    description: 'Official Android SDK Platform-Tools package containing adb, fastboot, and sqlite3 CLI utilities.',
    changelog: '• Support for Wireless ADB debugging pair code command\n• Updated USB drivers for Pixel 8 series',
    developer: 'Google Developers',
    uploadDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    downloadCount: 8430,
    rating: 5.0,
    iconUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=150&auto=format&fit=crop&q=80',
    iconBgColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    sha256: '3c88d123884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    md5: '4f41402abc4b2a76b9719d911017c592',
    isVerified: true,
    tags: ['zip', 'sdk', 'adb', 'fastboot', 'developer-tools']
  }
];

/**
 * Subscribe to real-time Cloud Firestore updates across all devices
 */
export function subscribeToFiles(callback: (files: HostedFile[]) => void): () => void {
  const colRef = collection(db, COLLECTION_NAME);
  
  return onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty) {
      // Seed Firestore on first run
      await seedInitialCloudFiles();
      return;
    }

    const files: HostedFile[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as HostedFile;
      return {
        ...data,
        id: docSnap.id,
      };
    });

    callback(files);
  }, (err) => {
    console.warn('Firestore subscription error, using local fallback:', err);
    // Fallback to Express backend or localStorage
    getAllFiles().then(callback);
  });
}

/**
 * Seed initial catalog to Cloud Firestore database if empty
 */
async function seedInitialCloudFiles() {
  try {
    for (const file of SEED_FILES) {
      const docRef = doc(db, COLLECTION_NAME, file.id);
      await setDoc(docRef, file);
    }
  } catch (err) {
    console.error('Error seeding Cloud Firestore:', err);
  }
}

/**
 * Fetch all files from Cloud Firestore
 */
export async function getAllFiles(): Promise<HostedFile[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => docSnap.data() as HostedFile);
    }
  } catch (err) {
    console.warn('Firestore fetch error, falling back to server backend:', err);
  }

  // Server API fallback
  try {
    const res = await fetch('/api/files');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error('Server fallback fetch error:', e);
  }

  return SEED_FILES;
}

/**
 * Save new published file to Cloud Firestore and Express server
 */
export async function saveHostedFile(fileMeta: HostedFile, fileBlob?: Blob | File): Promise<HostedFile> {
  const docRef = doc(db, COLLECTION_NAME, fileMeta.id);

  // Clean undefined properties for Firestore
  const cleanData: Record<string, any> = {};
  Object.entries(fileMeta).forEach(([k, v]) => {
    if (v !== undefined) {
      cleanData[k] = v;
    }
  });

  // Save to Cloud Firestore
  try {
    await setDoc(docRef, cleanData);
  } catch (err) {
    console.error('Error saving document to Cloud Firestore:', err);
  }

  // Also post binary file to Express server backend
  try {
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

    await fetch('/api/files/upload', {
      method: 'POST',
      body: formData,
    });
  } catch (err) {
    console.warn('Express upload note:', err);
  }

  return fileMeta;
}

/**
 * Delete hosted file from Cloud Firestore database
 */
export async function deleteHostedFile(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);

    fetch(`/api/files/${id}`, { method: 'DELETE' }).catch(() => {});
    return true;
  } catch (err) {
    console.error('Error deleting document from Firestore:', err);
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
      downloadCount: increment(1)
    });
  } catch (err) {
    console.warn('Download count update in Cloud Firestore:', err);
  }
  return 1;
}

export function getDownloadUrl(id: string): string {
  return `/api/files/download/${id}`;
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
