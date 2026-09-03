import { AVATAR_MAX_SIZE_BYTES } from "../constants";

export function formatDOB(
  dob: string | null | undefined,
  locale = "en-US",
): string {
  if (!dob) return "—";
  try {
    const d = new Date(dob);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export function formatGender(gender: string | null | undefined): string {
  if (!gender || !gender.trim()) return "—";
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}

export function formatStatus(status: string | null | undefined): string {
  if (!status) return "—";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function getInitials(
  firstName?: string,
  lastName?: string,
): string {
  return (
    [firstName, lastName]
      .map((s) => s?.charAt(0) ?? "")
      .filter(Boolean)
      .join("")
      .toUpperCase() || "?"
  );
}

const MAX_DIMENSION = 800;
const COMPRESS_QUALITY = 0.8;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

function compressImage(img: HTMLImageElement): string {
  let { width, height } = img;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/webp", COMPRESS_QUALITY);
}

export function processAvatarFile(
  file: File,
): Promise<import("../types").AvatarUploadData> | { error: string } {
  if (!file.type.startsWith("image/")) {
    return { error: "pleaseUploadImageFile" };
  }
  if (file.size > AVATAR_MAX_SIZE_BYTES) {
    return { error: "imageSizeMustBeLessThan5MB" };
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const img = await loadImage(dataUrl);
        const imageData =
          img.width > MAX_DIMENSION || img.height > MAX_DIMENSION
            ? compressImage(img)
            : dataUrl;
        resolve({
          imageData,
          preferredFormat: "webp" as const,
          quality: 80,
        });
      } catch {
        resolve({
          imageData: reader.result as string,
          preferredFormat: "webp" as const,
          quality: 80,
        });
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
