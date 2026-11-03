import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBytes,
  detectFileType,
  generateMockChecksums,
  parsePackageFromFilename,
  filterAndSortFiles,
} from './fileHelpers';
import { HostedFile } from '../types/file';

test('formatBytes formats file sizes correctly', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1048576), '1 MB');
  assert.equal(formatBytes(52428800), '50 MB');
  assert.equal(formatBytes(1073741824), '1 GB');
});

test('detectFileType classifies extension correctly', () => {
  assert.equal(detectFileType('app-release.apk'), 'apk');
  assert.equal(detectFileType('bundle.xapk'), 'xapk');
  assert.equal(detectFileType('project-source.zip'), 'zip');
  assert.equal(detectFileType('archive.tar.gz'), 'zip');
  assert.equal(detectFileType('document.pdf'), 'other');
});

test('generateMockChecksums produces expected lengths', () => {
  const { sha256, md5 } = generateMockChecksums('my-apk-file.apk');
  assert.equal(md5.length, 32);
  assert.equal(sha256.length, 64);
});

test('parsePackageFromFilename extracts package details correctly', () => {
  const result = parsePackageFromFilename('com.spotify.music_v8.9.1.apk');
  assert.equal(result.fileType, 'apk');
  assert.equal(result.packageName, 'com.spotify.music');
  assert.equal(result.version, '8.9.1');
  assert.equal(result.title, 'Music');
});

test('filterAndSortFiles filters by category and searches', () => {
  const sampleFiles: HostedFile[] = [
    {
      id: '1',
      title: 'VLC Media Player',
      filename: 'vlc.apk',
      fileType: 'apk',
      fileSize: 35000000,
      version: '3.5.0',
      category: 'Media',
      description: 'Open source video player',
      developer: 'VideoLAN',
      uploadDate: '2026-01-01T00:00:00.000Z',
      downloadCount: 150,
      rating: 4.8,
      sha256: 'abc',
      md5: 'def',
      isVerified: true,
      tags: ['video', 'media'],
    },
    {
      id: '2',
      title: 'Dev Tools Kit',
      filename: 'devtools.zip',
      fileType: 'zip',
      fileSize: 12000000,
      version: '1.0.0',
      category: 'Developer Kits',
      description: 'Useful scripts and configs',
      developer: 'CodeCraft',
      uploadDate: '2026-02-01T00:00:00.000Z',
      downloadCount: 500,
      rating: 4.9,
      sha256: 'ghi',
      md5: 'jkl',
      isVerified: true,
      tags: ['zip', 'dev', 'tools'],
    },
  ];

  // Filter category Media
  const mediaOnly = filterAndSortFiles(sampleFiles, '', 'Media', 'all', 'newest');
  assert.equal(mediaOnly.length, 1);
  assert.equal(mediaOnly[0].title, 'VLC Media Player');

  // Search 'scripts'
  const searchResult = filterAndSortFiles(sampleFiles, 'scripts', 'All', 'all', 'newest');
  assert.equal(searchResult.length, 1);
  assert.equal(searchResult[0].title, 'Dev Tools Kit');

  // Sort by downloads descending
  const sortedByDownloads = filterAndSortFiles(sampleFiles, '', 'All', 'all', 'downloads');
  assert.equal(sortedByDownloads[0].title, 'Dev Tools Kit');
});
