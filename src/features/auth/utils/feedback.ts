import { toast } from "react-hot-toast";
import i18n from "@/lib/i18n";

const NS = "common";

/** Shorthand: toast.success with i18n key */
export function toastSuccess(key: string, fallback?: string) {
  toast.success(i18n.t(key, { ns: NS }) || fallback || key);
}

/** Shorthand: toast.error with i18n key */
export function toastError(key: string, fallback?: string) {
  toast.error(i18n.t(key, { ns: NS }) || fallback || key);
}

/** Shorthand: toast.error with raw message (already translated) */
export function toastErrorRaw(message: string) {
  toast.error(message);
}

/** Shorthand: toast.success with raw message (already translated) */
export function toastSuccessRaw(message: string) {
  toast.success(message);
}

/** Translate a key from the common namespace */
export function t(key: string): string {
  return i18n.t(key, { ns: NS });
}
