// Updated DynamicFormModal with color picker and image editor support
"use client";
import React, { useEffect, useState } from "react";
import { X, Upload, Pencil } from "lucide-react";
import { apiRequest } from "@/lib/api/apiClients";
import { useToast } from "@/contexts/ToastContext";
import ImageEditor from "./ImageEditor";

type FieldType =
  | "text"
  | "email"
  | "password"
  | "select"
  | "textarea"
  | "file"
  | "date"
  | "color"
  | string;

interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  required?: boolean;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  onChange?: (val: string) => void;
}

interface DynamicFormModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  fields: Field[];
  endpoint?: string;
  method?: "POST" | "PUT";
  editId?: number | string;
  defaultValues?: Record<string, any> | null;
  onSuccess?: () => void;
  onSubmit?: (formData: FormData) => Promise<any>;
}

export default function DynamicFormModal({
  title,
  isOpen,
  onClose,
  fields,
  endpoint,
  method = "POST",
  editId,
  defaultValues = {},
  onSuccess,
  onSubmit,
}: DynamicFormModalProps) {
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [editingImage, setEditingImage] = useState<{ fieldName: string; index: number; src: string } | null>(null);
  
  const { showSuccess, showError } = useToast();
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!isOpen) {
      setFormState({});
      setError("");
      return;
    }
    const normalized: Record<string, any> = {};

    if (defaultValues) {
      for (const [k, v] of Object.entries(defaultValues)) {
        if (v === null || v === undefined) {
          normalized[k] = "";
          continue;
        }

        if (typeof v === "string" && v.startsWith("[") && v.endsWith("]")) {
          try {
            const parsed = JSON.parse(v);
            if (Array.isArray(parsed)) {
              normalized[k] = parsed;
              continue;
            }
          } catch {}
        }

        normalized[k] = typeof v === "number" ? String(v) : v;
      }
    }

    fields.forEach((f) => {
      if (f.type === "file") {
        const val = normalized[f.name];
        normalized[f.name] = Array.isArray(val) ? val : val ? [val] : [];
      }
    });

    setFormState(normalized);
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;

    if (target.type === "file") {
      const files = target.files ? Array.from(target.files) : [];

      setFormState((prev) => {
        const prevArr = Array.isArray(prev[target.name])
          ? [...prev[target.name]]
          : [];

        if (target.multiple) {
          files.forEach((file) => {
            if (
              !prevArr.find(
                (f) =>
                  f instanceof File &&
                  f.name === file.name &&
                  f.size === file.size
              )
            ) {
              prevArr.push(file);
            }
          });

          return { ...prev, [target.name]: prevArr };
        }

        return { ...prev, [target.name]: files.length ? [files[0]] : [] };
      });

      target.value = "";
      return;
    }

    const value = target.value;
    setFormState((prev) => ({ ...prev, [target.name]: value }));
  };

  const removeFile = (fieldName: string, index: number) => {
    setFormState((prev) => {
      const arr = Array.isArray(prev[fieldName]) ? [...prev[fieldName]] : [];
      arr.splice(index, 1);
      return { ...prev, [fieldName]: arr };
    });
  };

  const handleSaveEditedImage = (croppedBlob: Blob) => {
    if (!editingImage) return;

    const { fieldName, index } = editingImage;
    const file = new File([croppedBlob], `edited_${Date.now()}.jpg`, { type: "image/jpeg" });

    setFormState((prev) => {
      const arr = Array.isArray(prev[fieldName]) ? [...prev[fieldName]] : [];
      arr[index] = file;
      return { ...prev, [fieldName]: arr };
    });

    setEditingImage(null);
  };

  const buildFormData = () => {
    const fd = new FormData();

    for (const field of fields) {
      const val = formState[field.name];

      if (field.type === "file") {
        const arr = Array.isArray(val) ? val : [];
        arr.forEach((item) => {
          if (item instanceof File) fd.append(field.name, item);
          else if (typeof item === "string") fd.append(field.name, item);
        });
      } else {
        fd.append(
          field.name,
          typeof val === "object" ? JSON.stringify(val) : String(val ?? "")
        );
      }
    }

    return fd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fd = buildFormData();

      if (onSubmit) await onSubmit(fd);
      else {
        if (!endpoint) throw new Error("No endpoint provided");
        const url = editId ? `${endpoint}/${editId}` : endpoint;
        await apiRequest(url, method, fd, true);
      }

      onSuccess?.();
      showSuccess("Submit successfully");
      onClose();
    } catch (err: any) {
      const msg = err?.message || "Error occurred";
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const FileButton = ({ field }: { field: Field }) => (
    <>
      <label
        htmlFor={`file-${field.name}`}
        className="cursor-pointer inline-flex items-center gap-2 bg-[#4A4229] hover:bg-[#3D3622] text-[#FAF8F3] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
      >
        <Upload size={16} />
        Choose File
      </label>

      <input
        id={`file-${field.name}`}
        type="file"
        name={field.name}
        multiple={field.multiple}
        onChange={handleChange}
        disabled={field.disabled}
        className="hidden"
      />
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-0 relative border border-[#EAE4D3]">
        <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-extrabold text-[#2C271D] mb-5 tracking-tight">{title}</h2>
          {error && <p className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs font-semibold mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => {
              const raw = formState[field.name];

              if (field.type === "textarea") {
                return (
                  <div key={field.name}>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#857A68] mb-1.5">{field.label}</label>
                    <textarea
                      name={field.name}
                      value={raw || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full bg-[#FAF8F3] border border-[#EAE4D3] rounded-xl p-3 text-xs font-bold text-[#2C271D] focus:bg-white focus:ring-2 focus:ring-[#D5C58A] focus:border-[#D5C58A] outline-none transition-all"
                    />
                  </div>
                );
              }

              if (field.type === "select") {
                return (
                  <div key={field.name}>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#857A68] mb-1.5">{field.label}</label>
                    <select
                      name={field.name}
                      value={raw ?? ""}
                      onChange={(e) => {
                        handleChange(e);
                        field.onChange?.(e.target.value);
                      }}
                      disabled={field.disabled}
                      className="w-full bg-[#FAF8F3] border border-[#EAE4D3] rounded-xl p-3 text-xs font-bold text-[#2C271D] focus:bg-white focus:ring-2 focus:ring-[#D5C58A] focus:border-[#D5C58A] outline-none transition-all"
                    >
                      <option value="">Select...</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === "file") {
                const files: any[] = Array.isArray(raw) ? raw : [];

                return (
                  <div key={field.name}>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#857A68] mb-1.5">{field.label}</label>
                    <FileButton field={field} />

                    {files.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-3">
                        {files.map((file: any, i: number) => {
                          const isImage =
                            file instanceof File
                              ? file.type.startsWith("image/")
                              : typeof file === "string"
                              ? /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
                              : false;

                          const isVideo =
                            file instanceof File
                              ? file.type.startsWith("video/")
                              : typeof file === "string"
                              ? /\.(mp4|webm|ogg)$/i.test(file)
                              : false;

                          const name =
                            file instanceof File
                              ? file.name
                              : String(file).split("/").pop();

                          const src = file instanceof File
                            ? URL.createObjectURL(file)
                            : (file?.startsWith('http') ? file : base_url + file);

                          return (
                            <div
                              key={i}
                              className="relative border border-[#EAE4D3] rounded-xl p-2 w-28 text-xs bg-[#FAF8F3]"
                            >
                              {isImage ? (
                                <div className="relative group">
                                  <img
                                    src={src}
                                    alt="preview"
                                    className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => window.open(src, "_blank")}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setEditingImage({ fieldName: field.name, index: i, src })}
                                    className="absolute cursor-pointer top-1 left-1 bg-white/90 border border-[#EAE4D3] rounded-full p-1 text-[#8C7E4F] hover:bg-white transition-colors shadow-xs"
                                    title="Edit Image"
                                  >
                                    <Pencil size={12} />
                                  </button>
                                </div>
                              ) : isVideo ? (
                                <video
                                  src={src}
                                  className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => window.open(src, "_blank")}
                                />
                              ) : (
                                <p className="truncate font-semibold text-xs text-[#2C271D]">{name}</p>
                              )}

                              <button
                                type="button"
                                onClick={() => removeFile(field.name, i)}
                                className="absolute cursor-pointer -top-2 -right-2 bg-white border border-[#EAE4D3] rounded-full p-1 text-rose-500 hover:bg-rose-50 shadow-xs"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              if (field.type === "color") {
                return (
                  <div key={field.name}>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#857A68] mb-1.5">{field.label}</label>
                    <input
                      type="color"
                      name={field.name}
                      value={raw && raw !== "" ? raw : "#000000"}
                      onChange={handleChange}
                      className="w-16 h-10 p-1 border border-[#EAE4D3] rounded-xl cursor-pointer"
                    />
                  </div>
                );
              }

              return (
                <div key={field.name}>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#857A68] mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={raw ?? ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full bg-[#FAF8F3] border border-[#EAE4D3] rounded-xl p-3 text-xs font-bold text-[#2C271D] focus:bg-white focus:ring-2 focus:ring-[#D5C58A] focus:border-[#D5C58A] outline-none transition-all"
                  />
                </div>
              );
            })}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-[#4A4229] hover:bg-[#3D3622] text-[#FAF8F3] py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {editingImage && (
        <ImageEditor
          image={editingImage.src}
          onSave={handleSaveEditedImage}
          onCancel={() => setEditingImage(null)}
        />
      )}
    </div>
  );
}
