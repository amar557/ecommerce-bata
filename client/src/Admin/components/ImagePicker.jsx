import { useId, useRef } from "react";
import { FiImage, FiUpload, FiX } from "react-icons/fi";

/**
 * Polished image chooser for admin forms (brands, categories, accessories, etc.)
 */
export default function ImagePicker({
  label = "Image",
  preview,
  onChange,
  onClear,
  accept = "image/*",
  hint = "PNG, JPG or WEBP — up to a few MB",
}) {
  const inputId = useId();
  const inputRef = useRef(null);

  const handleFile = (file) => {
    onChange?.(file || null);
  };

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="block text-sm capitalize font-semibold my-2"
        >
          {label}
        </label>
      ) : null}

      <div
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
          preview
            ? "border-deepRed-200 bg-deepRed-50/40"
            : "border-slate-300 bg-slate-50 hover:border-deepRed-400 hover:bg-deepRed-50/30"
        }`}
      >
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            handleFile(file);
          }}
        />

        {preview ? (
          <div className="flex items-center gap-4 p-3 sm:p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white shadow-sm bg-white">
              <img
                src={preview}
                alt="Selected preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Image selected
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-deepRed-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-deepRed-700 transition"
                >
                  <FiUpload className="text-sm" />
                  Change image
                </button>
                {onClear && (
                  <button
                    type="button"
                    onClick={() => {
                      if (inputRef.current) inputRef.current.value = "";
                      onClear();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-slate-100 transition"
                  >
                    <FiX className="text-sm" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 px-4 py-8 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-deepRed-600">
              <FiImage className="text-xl" />
            </span>
            <span className="text-sm font-semibold text-gray-900">
              Choose image
            </span>
            <span className="text-xs text-gray-500 max-w-[16rem]">{hint}</span>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-deepRed-600 px-4 py-2 text-xs font-semibold text-white shadow-sm">
              <FiUpload className="text-sm" />
              Browse files
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
