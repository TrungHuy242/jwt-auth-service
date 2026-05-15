import { z } from "zod";

export const uploadFileSchema = z.object({
  folder: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập folder")
    .default("general"),

  mode: z.enum(["single", "multiple"], {
    message: "Vui lòng chọn chế độ upload",
  }),
});

export const fileFilterSchema = z.object({
  search: z.string().optional(),
  folder: z.string().optional(),
  type: z.string().optional(),
});
