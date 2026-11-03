import { HostedFile, StorageStats } from '../types/file';
import { generateMockChecksums } from '../utils/fileHelpers';

const DB_NAME = 'APKVaultDB';
const DB_VERSION = 1;
const STORE_FILES = 'files';
const STORE_BLOBS = 'blobs';

// Sample pre-populated initial catalog
const SEED_FILES: HostedFile[] = [
  {
    id: 'seed-vlc-apk',
    title: 'VLC Media Player',
    filename: 'org.videolan.vlc_v3.5.4.apk',
    fileType: 'apk',
    fileSize: 34857600, // ~34.8 MB
    version: '3.5.4',
    packageName: 'org.videolan.vlc',
    minSdk: 'Android 6.0+ (API 23)',
    category: 'Media',
    description: 'VLC for Android is a full audio & video player that plays most local video and audio files, as well as network streams. Includes subtitle support, equalizers, and multi-track audio.',
    changelog: '• Added support for AV1 video codec playback\n• Improved SMB v3 network shares browsing\n• Redesigned audio player interface and lockscreen widget\n• Performance optimizations for Android 14',
    developer: 'VideoLAN Organization',
    uploadDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    downloadCount: 14280,
    rating: 4.9,
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    iconBgColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    sha256: generateMockChecksums('org.videolan.vlc_v3.5.4.apk').sha256,
    md5: generateMockChecksums('org.videolan.vlc_v3.5.4.apk').md5,
    isVerified: true,
    tags: ['video', 'audio', 'player', 'media', 'open-source', 'streaming'],
    permissions: [
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.INTERNET',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.WAKE_LOCK'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'seed-newpipe-apk',
    title: 'NewPipe Lightweight Player',
    filename: 'org.schabi.newpipe_v0.27.0.apk',
    fileType: 'apk',
    fileSize: 15420000, // ~15.4 MB
    version: '0.27.0',
    packageName: 'org.schabi.newpipe',
    minSdk: 'Android 5.0+ (API 21)',
    category: 'Media',
    description: 'A privacy-friendly, lightweight video streaming frontend for Android. Watch videos without Google Play Services, background audio playback, pop-up video player mode, and offline downloads.',
    changelog: '• Upgraded video stream parser for higher 4K 60fps stability\n• Added sponsor block integration toggle\n• Fixed playlist import from OPML files\n• Improved memory consumption on low-end devices',
    developer: 'Team NewPipe',
    uploadDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    downloadCount: 9850,
    rating: 4.8,
    iconUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150&auto=format&fit=crop&q=80',
    iconBgColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    sha256: generateMockChecksums('org.schabi.newpipe_v0.27.0.apk').sha256,
    md5: generateMockChecksums('org.schabi.newpipe_v0.27.0.apk').md5,
    isVerified: true,
    tags: ['streaming', 'youtube', 'privacy', 'background-play', 'lightweight'],
    permissions: [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.SYSTEM_ALERT_WINDOW'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'seed-fdroid-apk',
    title: 'F-Droid App Store',
    filename: 'org.fdroid.fdroid_v1.19.0.apk',
    fileType: 'apk',
    fileSize: 11200000, // ~11.2 MB
    version: '1.19.0',
    packageName: 'org.fdroid.fdroid',
    minSdk: 'Android 5.0+ (API 21)',
    category: 'Utilities',
    description: 'F-Droid is an installable catalog of FOSS (Free and Open Source Software) applications for the Android platform. Allows easy browsing, installing, and updating of open source apps.',
    changelog: '• Added automatic background repository index sync\n• Support for unattended app updates on Android 12+\n• Enhanced multi-mirror download fallback logic',
    developer: 'F-Droid Project',
    uploadDate: new Date(Date.now() - 86400000 * 12).toISOString(),
    downloadCount: 21400,
    rating: 4.9,
    iconUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80',
    iconBgColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    sha256: generateMockChecksums('org.fdroid.fdroid_v1.19.0.apk').sha256,
    md5: generateMockChecksums('org.fdroid.fdroid_v1.19.0.apk').md5,
    isVerified: true,
    tags: ['appstore', 'foss', 'open-source', 'installer', 'utilities'],
    permissions: [
      'android.permission.REQUEST_INSTALL_PACKAGES',
      'android.permission.INTERNET',
      'android.permission.RECEIVE_BOOT_COMPLETED'
    ]
  },
  {
    id: 'seed-retroarch-apk',
    title: 'RetroArch Gaming Hub',
    filename: 'com.retroarch.aarch64_v1.17.0.apk',
    fileType: 'apk',
    fileSize: 184500000, // ~184.5 MB
    version: '1.17.0',
    packageName: 'com.retroarch.aarch64',
    minSdk: 'Android 8.0+ (API 26)',
    category: 'Games',
    description: 'RetroArch is an open-source modular cross-platform emulation engine. Play classic console games, customize shaders, use netplay multiplayer, and save states seamlessly.',
    changelog: '• Updated Vulkan 1.3 rendering driver\n• Added touch gesture custom overlay layout editor\n• Netplay lobby match-making engine upgrade\n• Optimized Bluetooth game controller latency',
    developer: 'Libretro Team',
    uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    downloadCount: 16700,
    rating: 4.7,
    iconUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80',
    iconBgColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    sha256: generateMockChecksums('com.retroarch.aarch64_v1.17.0.apk').sha256,
    md5: generateMockChecksums('com.retroarch.aarch64_v1.17.0.apk').md5,
    isVerified: true,
    tags: ['games', 'emulator', 'retro', 'libretro', 'gaming', 'vulkan'],
    permissions: [
      'android.permission.MANAGE_EXTERNAL_STORAGE',
      'android.permission.BLUETOOTH_CONNECT',
      'android.permission.VIBRATE'
    ]
  },
  {
    id: 'seed-dev-tools-zip',
    title: 'ADB & Fastboot Platform Tools',
    filename: 'android-developer-platform-tools-r35.0.1.zip',
    fileType: 'zip',
    fileSize: 18900000, // ~18.9 MB
    version: '35.0.1',
    category: 'Developer Kits',
    description: 'Official Android SDK Platform-Tools package containing adb, fastboot, and sqlite3 command-line utilities for Android app debugging, APK sideloading, and flashing image files.',
    changelog: '• Support for Wireless ADB debugging pair code command\n• Updated USB drivers for Pixel 8 & Pixel Fold series\n• Enhanced buffer sizes during large APK pushes',
    developer: 'Google Developers',
    uploadDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    downloadCount: 8430,
    rating: 5.0,
    iconUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=150&auto=format&fit=crop&q=80',
    iconBgColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    sha256: generateMockChecksums('android-developer-platform-tools-r35.0.1.zip').sha256,
    md5: generateMockChecksums('android-developer-platform-tools-r35.0.1.zip').md5,
    isVerified: true,
    tags: ['zip', 'sdk', 'adb', 'fastboot', 'developer-tools', 'cli']
  },
  {
    id: 'seed-termux-apk',
    title: 'Termux Terminal & Linux Env',
    filename: 'com.termux_v0.118.0.apk',
    fileType: 'apk',
    fileSize: 9800000, // ~9.8 MB
    version: '0.118.0',
    packageName: 'com.termux',
    minSdk: 'Android 7.0+ (API 24)',
    category: 'Tools',
    description: 'Termux combines powerful terminal emulation with an extensive Linux package collection. Install Python, Node.js, Git, SSH, Vim, and compile software straight on your phone.',
    changelog: '• Added support for Python 3.12 packages\n• Fixed virtual keyboard extra keys row custom bindings\n• Updated openssh and zsh default packages',
    developer: 'Fredrik Fornwall',
    uploadDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    downloadCount: 18900,
    rating: 4.9,
    iconUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=150&auto=format&fit=crop&q=80',
    iconBgColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    sha256: generateMockChecksums('com.termux_v0.118.0.apk').sha256,
    md5: generateMockChecksums('com.termux_v0.118.0.apk').md5,
    isVerified: true,
    tags: ['terminal', 'linux', 'bash', 'python', 'cli', 'developer'],
    permissions: [
      'android.permission.INTERNET',
      'android.permission.WAKE_LOCK'
    ]
  },
  {
    id: 'seed-react-native-template-zip',
    title: 'React Native Mobile Boilerplate',
    filename: 'react-native-boilerplate-v3.2.0.zip',
    fileType: 'zip',
    fileSize: 4250000, // ~4.2 MB
    version: '3.2.0',
    category: 'Developer Kits',
    description: 'Production-ready TypeScript starter kit for cross-platform mobile apps featuring Zustand state management, React Navigation v6, Tailwind / NativeWind styling, and Jest unit tests.',
    changelog: '• Upgraded to React Native 0.73 with Hermes V8 engine\n• Added dark mode auto-theme switcher hooks\n• Standardized biometrics login screen component',
    developer: 'CodeCraft Studio',
    uploadDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    downloadCount: 3120,
    rating: 4.8,
    iconUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&auto=format&fit=crop&q=80',
    iconBgColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    sha256: generateMockChecksums('react-native-boilerplate-v3.2.0.zip').sha256,
    md5: generateMockChecksums('react-native-boilerplate-v3.2.0.zip').md5,
    isVerified: true,
    tags: ['zip', 'react-native', 'typescript', 'boilerplate', 'template']
  }
];

// Helper to create a synthetic downloadable blob with dummy content
function createMockBinaryBlob(file: HostedFile): Blob {
  const headerText = `[APKVault Hosted File Package]\nFilename: ${file.filename}\nType: ${file.fileType}\nVersion: ${file.version}\nPackage: ${file.packageName || 'N/A'}\nChecksum SHA256: ${file.sha256}\nGenerated for downloading on ${new Date().toISOString()}\n` +
    'X'.repeat(512); // Padding payload
  const mimeType = file.fileType === 'apk' || file.fileType === 'xapk' 
    ? 'application/vnd.android.package-archive' 
    : 'application/zip';
  return new Blob([headerText], { type: mimeType });
}

// Open or initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_FILES)) {
        db.createObjectStore(STORE_FILES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_BLOBS)) {
        db.createObjectStore(STORE_BLOBS, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllFiles(): Promise<HostedFile[]> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_FILES], 'readonly');
    const store = transaction.objectStore(STORE_FILES);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = async () => {
        let files: HostedFile[] = request.result || [];
        if (files.length === 0) {
          // First run: seed database with initial files
          files = await seedInitialFiles();
        }
        resolve(files);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Error fetching files from IndexedDB:', err);
    return SEED_FILES;
  }
}

async function seedInitialFiles(): Promise<HostedFile[]> {
  const db = await openDB();
  const tx = db.transaction([STORE_FILES, STORE_BLOBS], 'readwrite');
  const fileStore = tx.objectStore(STORE_FILES);
  const blobStore = tx.objectStore(STORE_BLOBS);

  for (const file of SEED_FILES) {
    fileStore.put(file);
    const mockBlob = createMockBinaryBlob(file);
    blobStore.put({ id: file.id, blob: mockBlob });
  }

  return new Promise((resolve) => {
    tx.oncomplete = () => resolve(SEED_FILES);
  });
}

export async function saveHostedFile(file: HostedFile, blob?: Blob): Promise<HostedFile> {
  const db = await openDB();
  const tx = db.transaction([STORE_FILES, STORE_BLOBS], 'readwrite');
  const fileStore = tx.objectStore(STORE_FILES);
  const blobStore = tx.objectStore(STORE_BLOBS);

  fileStore.put(file);
  const fileBlob = blob || createMockBinaryBlob(file);
  blobStore.put({ id: file.id, blob: fileBlob });

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(file);
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteHostedFile(id: string): Promise<boolean> {
  const db = await openDB();
  const tx = db.transaction([STORE_FILES, STORE_BLOBS], 'readwrite');
  tx.objectStore(STORE_FILES).delete(id);
  tx.objectStore(STORE_BLOBS).delete(id);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(false);
  });
}

export async function getFileBlob(id: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    const tx = db.transaction([STORE_BLOBS], 'readonly');
    const request = tx.objectStore(STORE_BLOBS).get(id);

    return new Promise((resolve) => {
      request.onsuccess = () => {
        if (request.result && request.result.blob) {
          resolve(request.result.blob as Blob);
        } else {
          // Fallback matching seed file
          const match = SEED_FILES.find((f) => f.id === id);
          if (match) {
            resolve(createMockBinaryBlob(match));
          } else {
            resolve(null);
          }
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch (err) {
    console.error('Error fetching file blob:', err);
    return null;
  }
}

export async function incrementDownloadCount(id: string): Promise<number> {
  const db = await openDB();
  const tx = db.transaction([STORE_FILES], 'readwrite');
  const store = tx.objectStore(STORE_FILES);
  const getReq = store.get(id);

  return new Promise((resolve) => {
    getReq.onsuccess = () => {
      const file: HostedFile | undefined = getReq.result;
      if (file) {
        file.downloadCount += 1;
        store.put(file);
        resolve(file.downloadCount);
      } else {
        resolve(0);
      }
    };
    getReq.onerror = () => resolve(0);
  });
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
