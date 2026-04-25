import type { ContactFormData } from "../../types";
import { apiPost } from "./client";

export type { ContactFormData };

export async function postContactForm(
  data: ContactFormData,
): Promise<{ success: boolean }> {
  await apiPost("/posts", data);
  return { success: true };
}
