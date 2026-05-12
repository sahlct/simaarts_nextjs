"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, RotateCw, ZoomIn, ZoomOut, Check, Maximize } from "lucide-react";
import getCroppedImg from "@/lib/imageUtils";

interface ImageEditorProps {
  image: string;
  onSave: (croppedImage: Blob) => void;
  onCancel: () => void;
}

const ASPECT_RATIOS = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "2:3", value: 2 / 3 },
];

export default function ImageEditor({ image, onSave, onCancel }: ImageEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(ASPECT_RATIOS[1].value); // Default 1:1
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      if (croppedImage) {
        onSave(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between text-white mb-4">
        <h3 className="text-lg font-semibold">Edit Image</h3>
        <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Cropper Container */}
      <div className="relative flex-1 bg-black rounded-lg overflow-hidden border border-white/10">
        <Cropper
          image={image}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      {/* Controls */}
      <div className="mt-6 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Zoom & Rotate */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span className="flex items-center gap-2"><ZoomIn size={14} /> Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#036ec6]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span className="flex items-center gap-2"><RotateCw size={14} /> Rotation</span>
                <span>{rotation}°</span>
              </div>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#036ec6]"
              />
            </div>
          </div>

          {/* Aspect Ratios */}
          <div className="space-y-3">
            <span className="text-sm text-white/60 flex items-center gap-2"><Maximize size={14} /> Aspect Ratio</span>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.label}
                  onClick={() => setAspect(ratio.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    aspect === ratio.value
                      ? "bg-[#036ec6] text-white shadow-lg shadow-[#036ec6]/20"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#036ec6] hover:bg-[#0361ad] text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-[#036ec6]/20 transition-all active:scale-95"
          >
            <Check size={18} /> Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
