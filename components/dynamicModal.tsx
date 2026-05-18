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
  }, [defaultValues, isOpen, fields]);

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
        className="cursor-pointer inline-flex items-center gap-2 bg-[#036ec6] text-white px-4 py-2 rounded-md hover:bg-[#0361ad]"
      >
        <Upload size={18} />
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
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-0 relative">
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-semibold text-[#036ec6] mb-4">{title}</h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => {
              const raw = formState[field.name];

              if (field.type === "textarea") {
                return (
                  <div key={field.name}>
                    <label className="block text-sm mb-1">{field.label}</label>
                    <textarea
                      name={field.name}
                      value={raw || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full border rounded p-2"
                    />
                  </div>
                );
              }

              if (field.type === "select") {
                return (
                  <div key={field.name}>
                    <label className="block text-sm mb-1">{field.label}</label>
                    <select
                      name={field.name}
                      value={raw ?? ""}
                      onChange={(e) => {
                        handleChange(e);
                        field.onChange?.(e.target.value);
                      }}
                      disabled={field.disabled}
                      className="w-full border rounded p-2"
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
                    <label className="block text-sm mb-1">{field.label}</label>
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
                              className="relative border rounded-md p-2 w-28 text-xs bg-gray-50"
                            >
                              {isImage ? (
                                <div className="relative group">
                                  <img
                                    src={src}
                                    alt="preview"
                                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => window.open(src, "_blank")}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setEditingImage({ fieldName: field.name, index: i, src })}
                                    className="absolute cursor-pointer top-1 left-1 bg-white/90 border rounded-full p-1 text-[#036ec6] hover:bg-white transition-colors shadow-sm"
                                    title="Edit Image"
                                  >
                                    <Pencil size={12} />
                                  </button>
                                </div>
                              ) : isVideo ? (
                                <video
                                  src={src}
                                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => window.open(src, "_blank")}
                                />
                              ) : (
                                <p className="truncate">{name}</p>
                              )}

                              <button
                                type="button"
                                onClick={() => removeFile(field.name, i)}
                                className="absolute cursor-pointer -top-2 -right-2 bg-white border rounded-full p-1 text-red-500"
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
                    <label className="block text-sm mb-1">{field.label}</label>
                    <input
                      type="color"
                      name={field.name}
                      value={raw && raw !== "" ? raw : "#000000"}
                      onChange={handleChange}
                      className="w-16 h-10 p-1 border rounded cursor-pointer"
                    />
                  </div>
                );
              }

              return (
                <div key={field.name}>
                  <label className="block text-sm mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={raw ?? ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border rounded p-2"
                  />
                </div>
              );
            })}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-gradient-to-r from-[#036ec67c] to-[#0361ad] text-white py-2 mt-4 rounded-md"
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
