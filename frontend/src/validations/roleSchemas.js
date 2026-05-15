import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên role")
    .min(2, "Tên role phải có ít nhất 2 ký tự")
    .max(50, "Tên role tối đa 50 ký tự")
    .regex(
      /^[A-Za-z0-9_]+$/,
      "Tên role chỉ nên gồm chữ, số hoặc dấu gạch dưới"
    ),

  description: z.string().trim().optional().or(z.literal("")),
});
