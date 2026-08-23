import React, { useState } from 'react';
import { Flashlight, CheckCircle2, Scan } from 'lucide-react';
import { audioChime } from '../../utils/audioSynth';

export default function QRScanner({ onScanComplete, onClose }) {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [scannedMed, setScannedMed] = useState(null);
  const [manualCode, setManualCode] = useState('');

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    
    const detectedMed = {
      barcode: manualCode.trim(),
      name: `Prescription #${manualCode.trim().slice(-4)}`,
      dosage: '10mg',
      form: 'Tablet',
      pillColor: 'White',
      pillShape: 'round',
      times: ['08:00'],
      notes: 'Take with water after breakfast',
      compartment: 'Morning',
      instructions: 'Scanned from prescription package barcode.',
      caregiverNotify: true
    };

    setScanning(false);
    setScannedMed(detectedMed);
    audioChime.playSuccess();
    setTimeout(() => {
      onScanComplete(detectedMed);
    }, 900);
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

      {/* Manual Barcode Input Fallback */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Enter prescription barcode / NDC number..."
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
        <button
          type="submit"
          className="btn-primary text-sm px-5 py-3 min-h-[44px]"
        >
          <Scan className="w-4 h-4" />
          <span>Lookup</span>
        </button>
      </form>

    </div>
  );
}
