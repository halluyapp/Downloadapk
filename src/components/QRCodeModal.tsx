import React, { useEffect, useState } from 'react';
import { X, Smartphone, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { HostedFile } from '../types/file';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  file: HostedFile | null;
  onClose: () => void;
  onDownload: (file: HostedFile) => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  file,
  onClose,
  onDownload,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (file) {
      // Build direct share URL or download link
      const directUrl = window.location.href.split('?')[0] + `?download=${file.id}`;
      QRCode.toDataURL(directUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [file]);

  if (!file) return null;

  const downloadUrl = window.location.href.split('?')[0] + `?download=${file.id}`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-center space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2">
            <Smartphone className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Scan to Download on Phone</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Point your Android camera or QR scanner at the code below to download <strong className="text-white">{file.title}</strong> directly to your device.
          </p>
        </div>

        {/* QR Code Canvas */}
        <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border-4 border-slate-800">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Download QR Code" className="w-52 h-52 mx-auto" />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
              Generating QR Code...
            </div>
          )}
        </div>

        {/* Share Link Input */}
        <div className="bg-slate-950 p-2 border border-slate-800 rounded-xl flex items-center justify-between gap-2 text-xs">
          <span className="font-mono text-slate-400 truncate pl-2">{downloadUrl}</span>
          <button
            onClick={copyShareLink}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg shrink-0 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
          
          <button
            onClick={() => {
              onDownload(file);
              onClose();
            }}
            className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Direct Download</span>
          </button>
        </div>

      </div>
    </div>
  );
};
