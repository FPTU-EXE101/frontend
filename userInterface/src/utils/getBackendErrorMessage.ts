import axios from "axios";

export function getBackendErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string") return data;

    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.message)) return data.message.join("\n");

    if (typeof data?.error === "string") return data.error;
    if (Array.isArray(data?.error)) return data.error.join("\n");

    if (typeof data?.title === "string") return data.title;

    if (data?.errors && typeof data.errors === "object") {
      const messages = Object.values(data.errors)
        .flat()
        .filter(Boolean)
        .map(String);

      if (messages.length > 0) return messages.join("\n");
    }
  }

  return "Có lỗi xảy ra. Vui lòng thử lại.";
}
