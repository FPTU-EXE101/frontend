import authApi from "@/apis/authAPI";
import { setToken } from "@/lib/auth";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

/**
 * Cho phép "đổi cửa hàng" ngầm ở front-end mà không cần sửa backend.
 *
 * Bối cảnh: mỗi token JWT gắn cứng storeId, và cả /auth/login lẫn
 * /auth/join-store đều cần email + mật khẩu. Vì vậy để đổi sang cửa hàng khác
 * (kể cả cửa hàng chưa có tài khoản) một cách liền mạch, FE phải lưu lại thông
 * tin đăng nhập rồi tự phát lại các request đó.
 *
 * Mật khẩu được lưu trong sessionStorage (tự xoá khi đóng tab) và chỉ mã hoá
 * base64 để tránh đọc lướt — ĐÂY KHÔNG PHẢI mã hoá an toàn. Đánh đổi này là bắt
 * buộc khi không được thay đổi backend.
 */

const CRED_KEY = "pethub.switch.cred";

type StoredCredentials = { email: string; password: string };

export const saveSwitchCredentials = (
  email: string,
  password: string,
): void => {
  if (typeof window === "undefined") return;
  try {
    const encoded = btoa(
      unescape(encodeURIComponent(JSON.stringify({ email, password }))),
    );
    sessionStorage.setItem(CRED_KEY, encoded);
  } catch {
    /* bỏ qua nếu sessionStorage không khả dụng */
  }
};

export const getSwitchCredentials = (): StoredCredentials | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CRED_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(
      decodeURIComponent(escape(atob(raw))),
    ) as StoredCredentials;
    if (parsed?.email && parsed?.password) return parsed;
    return null;
  } catch {
    return null;
  }
};

export const clearSwitchCredentials = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CRED_KEY);
};

export const hasSwitchCredentials = (): boolean => getSwitchCredentials() !== null;

export const extractJwtToken = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value.split(".").length === 3 ? value : null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const data = value as Record<string, unknown>;
  const candidates = [
    data.token,
    data.accessToken,
    data.jwtToken,
    data.jwt,
    data.data,
  ];

  for (const candidate of candidates) {
    const token = extractJwtToken(candidate);
    if (token) {
      return token;
    }
  }

  return null;
};

export type SwitchStoreResult =
  | { ok: true }
  | { ok: false; reason: "no-credentials" }
  | { ok: false; reason: "needs-confirmation"; joined: boolean }
  | { ok: false; reason: "failed"; message: string };

/**
 * Đổi sang cửa hàng `storeId`:
 *  1. Thử đăng nhập thẳng (trường hợp đã có tài khoản ở cửa hàng đó).
 *  2. Nếu chưa có → tự tham gia (join-store) rồi đăng nhập lại — bỏ hẳn bước
 *     "tạo tài khoản mới" mà người dùng phải tự làm.
 * Toàn bộ dùng đúng các request hiện có, không đổi backend.
 *
 * Lưu ý: tài khoản ở cửa hàng MỚI cần xác nhận email trước khi đăng nhập được.
 * Khi đó login sẽ trả "account not confirmed yet". Vì trong luồng này mật khẩu
 * chắc chắn đúng (vừa dùng để đăng nhập cửa hàng hiện tại), nên login hụt sau
 * khi tham gia gần như chắc chắn là do CHƯA XÁC NHẬN EMAIL — ta báo riêng để
 * hướng dẫn người dùng, thay vì coi là lỗi sai mật khẩu.
 */
export const switchStore = async (
  storeId: string,
): Promise<SwitchStoreResult> => {
  const creds = getSwitchCredentials();
  if (!creds) return { ok: false, reason: "no-credentials" };

  const { email, password } = creds;

  const tryLogin = async (): Promise<string | null> => {
    try {
      const res = await authApi.loginUser({ email, password, storeId });
      return extractJwtToken(res?.data);
    } catch {
      return null;
    }
  };

  try {
    let token = await tryLogin();

    if (!token) {
      // Chưa tham gia cửa hàng này → tham gia ngầm rồi đăng nhập lại.
      let joined = false;
      try {
        await authApi.joinStore({ email, password, storeId });
        joined = true;
      } catch {
        /* có thể đã tham gia trước đó; vẫn thử đăng nhập lại bên dưới */
      }
      token = await tryLogin();

      if (!token) {
        // Đã tham gia nhưng tài khoản cửa hàng mới chưa xác nhận email.
        return { ok: false, reason: "needs-confirmation", joined };
      }
    }

    setToken(token);
    // Giữ lại thông tin cho các lần đổi sau.
    saveSwitchCredentials(email, password);
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: "failed", message: getBackendErrorMessage(err) };
  }
};
