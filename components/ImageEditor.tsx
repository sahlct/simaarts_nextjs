"use client";

import React, { useState, useRef, useEffect } from "react";
import { Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { X, RotateCw, ZoomIn, Check, Maximize } from "lucide-react";

interface ImageEditorProps {
  image: string;
  onSave: (croppedImage: Blob) => void;
  onCancel: () => void;
}

// aspect ratios for cropping
const ASPECT_RATIOS = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "2:3", value: 2 / 3 },
];

export default function ImageEditor({ image, onSave, onCancel }: ImageEditorProps) {
  const [aspect, setAspect] = useState<number | undefined>(ASPECT_RATIOS[0].value); // Default Free
  const cropperRef = useRef<CropperRef>(null);

  // Local state for sliders just for UI visual if needed, 
  // but advanced-cropper is best controlled via its own drag/zoom. 
  // However, we can hook up the sliders by calling methods on the cropperRef.
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleSave = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            onSave(blob);
          }
        }, "image/jpeg");
      }
    }
  };

  const onZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = Number(e.target.value);
    if (cropperRef.current) {
      // relative zoom change
      cropperRef.current.zoomImage(newZoom / zoom);
    }
    setZoom(newZoom);
  };

  const onRotateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRotation = Number(e.target.value);
    if (cropperRef.current) {
      // relative rotation change
      cropperRef.current.rotateImage(newRotation - rotation);
    }
    setRotation(newRotation);
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
      <div className="relative flex-1 bg-black rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
        <Cropper
          ref={cropperRef}
          src={image}
          stencilProps={{
            aspectRatio: aspect,
          }}
          className={"w-full h-full"}
          style={{ maxHeight: '70vh' }}
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
                min={0.5}
                max={3}
                step={0.1}
                onChange={onZoomChange}
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
                onChange={onRotateChange}
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
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${aspect === ratio.value || (ratio.label === "Free" && aspect === undefined)
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

