import React, { useState, useEffect } from 'react';
import { Camera, Flashlight, RefreshCw, Sparkles, Scan, CheckCircle2, X } from 'lucide-react';
import { SAMPLE_BARCODES } from '../../utils/constants';
import { audioChime } from '../../utils/audioSynth';

export default function QRScanner({ onScanComplete, onClose }) {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [scannedMed, setScannedMed] = useState(null);
  const [manualCode, setManualCode] = useState('');

  const handleSelectPreset = (sample) => {
    setScanning(false);
    setScannedMed(sample);
    audioChime.playSuccess();
    setTimeout(() => {
      onScanComplete(sample);
    }, 900);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode) return;
    const match = SAMPLE_BARCODES.find(s => s.barcode === manualCode.trim()) || {
      barcode: manualCode,
      name: `Prescription #${manualCode.slice(-4)}`,
      dosage: '10mg',
      form: 'Tablet',
      pillColor: 'White',
      pillShape: 'round',
      times: ['08:00'],
      notes: 'Take with water after meal',
      compartment: 'Morning',
      instructions: 'Auto-detected from barcode database.',
      caregiverNotify: true
    };
    handleSelectPreset(match);
  };

  return (
    <div className="space-y-6">
      
      {/* Viewfinder UI Container */}
      <div className="relative w-full aspect-4/3 max-h-[340px] bg-slate-950 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center border-4 border-slate-800">
        
        {/* Animated Scanning Beam */}
        {scanning && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent shadow-[0_0_15px_#2A7DE1] animate-bounce duration-1000 z-20" />
        )}

        {/* Viewfinder Corner Brackets */}
        <div className="absolute w-56 h-56 border-2 border-dashed border-white/40 rounded-3xl z-10 flex items-center justify-center pointer-events-none">
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary-400 rounded-tl-xl" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary-400 rounded-tr-xl" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary-400 rounded-bl-xl" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary-400 rounded-br-xl" />
          
          <div className="text-center text-white/70 text-xs font-semibold px-4 py-2 bg-black/40 rounded-xl backdrop-blur-xs">
            Align Prescription Barcode / QR Code
          </div>
        </div>

        {/* Camera Overlay Controls */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            type="button"
            onClick={() => setFlashlightOn(!flashlightOn)}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-colors ${
              flashlightOn
                ? 'bg-amber-400 text-slate-900 border-amber-300'
                : 'bg-black/40 text-white border-white/20 hover:bg-black/60'
            }`}
            title="Toggle Flashlight"
          >
            <Flashlight className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Success Animation */}
        {scannedMed && (
          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-white p-6 animate-fadeIn">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-2 animate-bounce" />
            <h4 className="text-xl font-black">{scannedMed.name}</h4>
            <p className="text-sm text-emerald-200 mt-1">{scannedMed.dosage} • {scannedMed.form}</p>
            <span className="text-xs text-white/70 mt-3">Autofilling medication form...</span>
          </div>
        )}

        {/* Live Video placeholder texture */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Demo Presets (1-Click Test Scans) */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span>Quick Demo Test Barcodes (Click to Auto-Scan)</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAMPLE_BARCODES.map(sample => (
            <button
              key={sample.barcode}
              type="button"
              onClick={() => handleSelectPreset(sample)}
              className="text-left p-3 bg-white hover:bg-primary-50 border border-slate-200 hover:border-primary-300 rounded-xl transition-all flex items-center justify-between group shadow-2xs min-h-[44px]"
            >
              <div>
                <div className="text-sm font-bold text-text group-hover:text-primary-600">
                  {sample.name} ({sample.dosage})
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  UPC: {sample.barcode} • {sample.compartment}
                </div>
              </div>
              <Scan className="w-4 h-4 text-slate-400 group-hover:text-primary-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Manual Barcode Input Fallback */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Or enter 12-digit barcode UPC number manually..."
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
        <button
          type="submit"
          className="btn-primary text-sm px-5 py-3 min-h-[44px]"
        >
          Lookup
        </button>
      </form>

    </div>
  );
}
