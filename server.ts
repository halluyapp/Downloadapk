import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { HostedFile } from './src/types/file.js';
import { parsePackageFromFilename, generateMockChecksums } from './src/utils/fileHelpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Directories setup
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'files.json');

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.error('Directory creation error:', e);
}

// Pre-seeded catalog
const INITIAL_SEED: HostedFile[] = [
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
    sha256: generateMockChecksums('org.videolan.vlc_v3.5.4.apk').sha256,
    md5: generateMockChecksums('org.videolan.vlc_v3.5.4.apk').md5,
    isVerified: true,
    tags: ['video', 'audio', 'player', 'media', 'open-source', 'streaming'],
    permissions: [
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.INTERNET',
      'android.permission.FOREGROUND_SERVICE'
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
    sha256: generateMockChecksums('org.schabi.newpipe_v0.27.0.apk').sha256,
    md5: generateMockChecksums('org.schabi.newpipe_v0.27.0.apk').md5,
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
    sha256: generateMockChecksums('org.fdroid.fdroid_v1.19.0.apk').sha256,
    md5: generateMockChecksums('org.fdroid.fdroid_v1.19.0.apk').md5,
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
    sha256: generateMockChecksums('com.retroarch.aarch64_v1.17.0.apk').sha256,
    md5: generateMockChecksums('com.retroarch.aarch64_v1.17.0.apk').md5,
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
    sha256: generateMockChecksums('android-developer-platform-tools-r35.0.1.zip').sha256,
    md5: generateMockChecksums('android-developer-platform-tools-r35.0.1.zip').md5,
    isVerified: true,
    tags: ['zip', 'sdk', 'adb', 'fastboot', 'developer-tools']
  }
];

function readDB(): HostedFile[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading JSON DB:', err);
  }
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED, null, 2));
  } catch (e) {
    console.error('Failed writing DB file:', e);
  }
  return INITIAL_SEED;
}

function saveDB(files: HostedFile[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(files, null, 2));
  } catch (e) {
    console.error('Error saving DB:', e);
  }
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2, 8);
    const safeName = (file.originalname || 'file.apk').replace(/[^a-zA-Z0-9\._\-]/g, '_');
    cb(null, `${uniqueId}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// API Routes

// GET /api/files - List all hosted files
app.get('/api/files', (_req, res) => {
  const files = readDB();
  res.json(files);
});

// POST /api/files/upload - Upload new file or create manual file entry
app.post('/api/files/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.warn('Multer file parsing warning/error, proceeding with body data:', err.message);
    }
    next();
  });
}, (req, res) => {
  try {
    const file = req.file;
    const body = req.body || {};

    const files = readDB();

    const originalName = file ? file.originalname : body.filename || `${(body.title || 'app').toLowerCase().replace(/\s+/g, '-')}.${body.fileType || 'apk'}`;
    const fileSize = file ? file.size : parseInt(body.fileSize || '15400000', 10);
    const parsed = parsePackageFromFilename(originalName);

    const checksums = generateMockChecksums(originalName + fileSize + Date.now());
    const fileId = `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Create file on disk if no file upload was attached
    let filePathOnDisk = file ? file.path : '';
    if (!file) {
      filePathOnDisk = path.join(UPLOADS_DIR, `${fileId}-${originalName}`);
      const mockPayload = Buffer.from(
        `[APKVault Hosted File Package]\nTitle: ${body.title || parsed.title}\nFilename: ${originalName}\nUploaded on ${new Date().toISOString()}\n` +
          '0'.repeat(2048)
      );
      try {
        fs.writeFileSync(filePathOnDisk, mockPayload);
      } catch (err) {
        console.error('Error writing file payload to disk:', err);
      }
    }

    const newHostedFile: HostedFile = {
      id: fileId,
      title: body.title || parsed.title || originalName,
      filename: originalName,
      fileType: (body.fileType as any) || parsed.fileType || 'apk',
      fileSize: fileSize,
      version: body.version || parsed.version || '1.0.0',
      packageName: body.packageName || parsed.packageName || undefined,
      minSdk: body.minSdk || 'Android 7.0+ (API 24)',
      category: body.category || 'Utilities',
      description: body.description || 'Uploaded APK or ZIP file package.',
      changelog: body.changelog || '• Initial public upload',
      developer: body.developer || 'Developer',
      uploadDate: new Date().toISOString(),
      downloadCount: 0,
      rating: 5.0,
      iconUrl: body.iconUrl || undefined,
      sha256: checksums.sha256,
      md5: checksums.md5,
      isVerified: true,
      tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()) : [parsed.fileType || 'apk'],
      downloadUrl: `/api/files/download/${fileId}`,
      permissions: (body.fileType === 'apk' || body.fileType === 'xapk') ? [
        'android.permission.INTERNET',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.ACCESS_NETWORK_STATE'
      ] : undefined
    };

    files.unshift(newHostedFile);
    saveDB(files);

    res.status(201).json(newHostedFile);
  } catch (err: any) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: err.message || 'Failed to publish file' });
  }
});

// GET /api/files/download/:id - Stream file download
app.get('/api/files/download/:id', (req, res) => {
  const { id } = req.params;
  const files = readDB();
  const fileIndex = files.findIndex((f) => f.id === id);

  if (fileIndex === -1) {
    return res.status(404).send('File not found');
  }

  const fileInfo = files[fileIndex];

  fileInfo.downloadCount += 1;
  files[fileIndex] = fileInfo;
  saveDB(files);

  let downloadFilePath = '';
  try {
    const matchingFiles = fs.readdirSync(UPLOADS_DIR).filter((f) => f.startsWith(id) || f.endsWith(fileInfo.filename));
    if (matchingFiles.length > 0) {
      downloadFilePath = path.join(UPLOADS_DIR, matchingFiles[0]);
    }
  } catch (e) {
    console.error('Error reading upload dir:', e);
  }

  if (!downloadFilePath || !fs.existsSync(downloadFilePath)) {
    downloadFilePath = path.join(UPLOADS_DIR, `${id}-${fileInfo.filename}`);
    const mockPayload = Buffer.from(
      `[APKVault Shared File]\nName: ${fileInfo.title}\nFilename: ${fileInfo.filename}\nType: ${fileInfo.fileType}\nVersion: ${fileInfo.version}\n` +
        '0'.repeat(2048)
    );
    try {
      fs.writeFileSync(downloadFilePath, mockPayload);
    } catch (e) {
      console.error('Error writing fallback download file:', e);
    }
  }

  const contentType = fileInfo.fileType === 'zip' ? 'application/zip' : 'application/vnd.android.package-archive';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.filename}"`);
  res.sendFile(downloadFilePath);
});

// DELETE /api/files/:id - Delete hosted file
app.delete('/api/files/:id', (req, res) => {
  const { id } = req.params;
  let files = readDB();
  const fileInfo = files.find((f) => f.id === id);

  if (!fileInfo) {
    return res.status(404).json({ error: 'File not found' });
  }

  files = files.filter((f) => f.id !== id);
  saveDB(files);

  try {
    const matchingFiles = fs.readdirSync(UPLOADS_DIR).filter((f) => f.startsWith(id) || f.endsWith(fileInfo.filename));
    for (const f of matchingFiles) {
      fs.unlinkSync(path.join(UPLOADS_DIR, f));
    }
  } catch (err) {
    console.error('Error removing file from disk:', err);
  }

  res.json({ success: true, id });
});

// Start Express and mount Vite dev server if in dev mode
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.SERVER_MODE === 'production';

  if (!isProduction) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
      });
      app.use(vite.middlewares);
      app.use('*', async (req, res, next) => {
        try {
          const url = req.originalUrl;
          let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
    } catch (err) {
      console.error('Vite dev middleware initialization fallback:', err);
      app.use(express.static(path.resolve(__dirname, 'dist')));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
      });
    }
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`APKVault server running at http://localhost:${PORT}`);
  });
}

startServer();
