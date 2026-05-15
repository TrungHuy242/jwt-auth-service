import { z } from "zod";

export const adminSettingsSchema = z.object({
  siteName: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên hệ thống")
    .min(2, "Tên hệ thống phải có ít nhất 2 ký tự"),

  siteLogo: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  systemEmail: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "Email hệ thống không hợp lệ",
    }),

  supportEmail: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "Email hỗ trợ không hợp lệ",
    }),

  footerText: z.string().trim().optional().or(z.literal("")),

  allowRegister: z.boolean(),
  allowGoogleLogin: z.boolean(),
  allowFacebookLogin: z.boolean(),
  maintenanceMode: z.boolean(),

  maxUploadSizeMB: z.coerce
    .number()
    .min(1, "Dung lượng upload tối thiểu là 1MB")
    .max(500, "Dung lượng upload tối đa là 500MB"),

  defaultUserRole: z.enum(["USER", "ADMIN"], {
    message: "Role mặc định không hợp lệ",
  }),
});
