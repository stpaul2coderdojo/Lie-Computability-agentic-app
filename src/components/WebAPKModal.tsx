/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Check,
  Copy,
  ExternalLink,
  X,
  Layers,
  Sparkles,
  ShieldCheck,
  Terminal,
  Cpu,
  Monitor
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface WebAPKModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebAPKModal: React.FC<WebAPKModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ai.studio';
  const manifestUrl = `${currentUrl}/manifest.json`;

  const bubblewrapCommand = `npm i -g @bubblewrap/cli
bubblewrap init --manifest="${manifestUrl}"
bubblewrap build`;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-950/40">
              <Smartphone className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100 font-mono">
                  WebAPK &amp; PWA Application Hub
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                  Android &amp; Desktop
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Install as a native standalone Android WebAPK, desktop app, or build via Bubblewrap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Quick 1-Click Install or Active State */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-purple-950/30 border border-cyan-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  {isInstalled ? 'Application Installed' : '1-Click Install WebAPK / PWA'}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                {isInstalled
                  ? 'The app is currently operating in native standalone windowed mode with offline caching enabled.'
                  : 'Install directly onto your Android device home screen, Chromebook, macOS, Windows, or Linux desktop.'}
              </p>
            </div>

            {!isInstalled && (
              <div className="shrink-0 w-full sm:w-auto">
                {isInstallable ? (
                  <button
                    onClick={async () => {
                      await install();
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install WebAPK Now</span>
                  </button>
                ) : (
                  <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Ready for Chrome/Safari Menu</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Android WebAPK & TWA Builder Section */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">
                  Google Play / Android WebAPK (Bubblewrap CLI)
                </h4>
              </div>
              <button
                onClick={() => copyText(bubblewrapCommand, 'bubblewrap')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
              >
                {copiedKey === 'bubblewrap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'bubblewrap' ? 'Copied' : 'Copy CLI Command'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Generate a signed Android APK (`.apk` / `.aab`) via Google's Trusted Web Activity (TWA) Bubblewrap:
            </p>

            <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              {bubblewrapCommand}
            </pre>
          </div>

          {/* iOS Safari Instructions */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">
                iOS Safari / iPadOS Installation
              </h4>
            </div>
            <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1 font-mono">
              <li>Open this web application in <span className="text-purple-300 font-semibold">Safari</span>.</li>
              <li>Tap the <span className="text-slate-200 font-semibold">Share</span> icon in the toolbar.</li>
              <li>Select <span className="text-cyan-300 font-semibold">Add to Home Screen</span>.</li>
            </ol>
          </div>

          {/* Direct Manifest & Metadata Link */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between gap-3 text-xs font-mono">
            <div className="min-w-0">
              <span className="text-slate-500 block mb-0.5">PWA Manifest Endpoint</span>
              <code className="text-purple-300 truncate block">{manifestUrl}</code>
            </div>
            <a
              href="/manifest.json"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>View Manifest</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            WebAPK Standard: <span className="text-slate-300">W3C PWA 2026</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
