import { z } from "zod";

export const leadSchema = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(80, "Имя слишком длинное"),
  contact: z
    .string()
    .min(3, "Укажите контакт")
    .max(120, "Контакт слишком длинный"),
  company: z.string().max(200).optional().default(""),
  task: z
    .string()
    .min(20, "Опишите задачу минимум 20 символов")
    .max(3000, "Описание слишком длинное"),
  budget: z.string().optional().default(""),
  consentPd: z.preprocess(
    (v) => v === true || v === "on",
    z.literal(true, {
      error: () => "Необходимо согласие на обработку персональных данных",
    })
  ),
  consentContact: z.preprocess(
    (v) => v === true || v === "on",
    z.literal(true, {
      error: () => "Необходимо согласие на обратную связь",
    })
  ),
  honeypot: z.string().max(0).optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const noteSchema = z.object({
  text: z.string().min(1, "Текст заметки пустой").max(2000),
});

export const statusSchema = z.object({
  status: z.enum([
    "NEW",
    "IN_PROGRESS",
    "NEED_REPLY",
    "CONSULTATION_SCHEDULED",
    "PROPOSAL_SENT",
    "CLOSED_WON",
    "CLOSED_LOST",
    "SPAM",
  ]),
});
