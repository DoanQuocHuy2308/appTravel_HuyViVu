// services/toastService.ts
import type { Toast } from "primereact/toast";

let _toastRef: Toast | null = null;

export const registerToast = (ref: Toast | null) => {
  _toastRef = ref;
};

export const showError = (
  summary = "Lỗi",
  detail?: string,
  life = 3000
) => {
  _toastRef?.show({
    severity: "error",
    summary,
    detail,
    life,
  });
};

export const showSuccess = (
  summary = "Thành công",
  detail?: string,
  life = 3000
) => {
  _toastRef?.show({
    severity: "success",
    summary,
    detail,
    life,
  });
};

export const showInfo = (summary = "Thông tin", detail?: string, life = 3000) => {
  _toastRef?.show({
    severity: "info",
    summary,
    detail,
    life,
  });
};
