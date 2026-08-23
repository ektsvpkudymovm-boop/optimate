import type { LucideIcon } from "lucide-react";
import { BarChart3, BookOpen, BriefcaseBusiness, MessagesSquare, Network, PanelsTopLeft } from "lucide-react";

export type DemoView = "overview" | "communications" | "knowledge" | "sales" | "processes" | "analytics";

export type DemoNavigationItem = { id: DemoView; label: string; icon: LucideIcon };

export const demoNavigation: DemoNavigationItem[] = [
  { id: "overview", label: "Обзор", icon: PanelsTopLeft },
  { id: "communications", label: "Коммуникации", icon: MessagesSquare },
  { id: "knowledge", label: "Знания", icon: BookOpen },
  { id: "sales", label: "Продажи", icon: BriefcaseBusiness },
  { id: "processes", label: "Процессы", icon: Network },
  { id: "analytics", label: "Аналитика", icon: BarChart3 },
];

export const guidedSequence: Array<{ view: DemoView; duration: number }> = [
  { view: "overview", duration: 2800 },
  { view: "communications", duration: 2800 },
  { view: "knowledge", duration: 3200 },
  { view: "processes", duration: 2800 },
  { view: "analytics", duration: 2800 },
  { view: "overview", duration: 4000 },
];

export const overviewEvents = [
  { time: "10:42", title: "Разговор обработан", description: "Определена потребность в аналоге товара; зафиксировано сомнение по сроку поставки.", status: "CRM обновлена", selected: true },
  { time: "10:18", title: "Найден подходящий аналог товара", description: "Система сопоставила характеристики, доступность и внутренние рекомендации.", status: "Ответ подготовлен" },
  { time: "09:36", title: "Повторяющийся запрос стал заметен", description: "В нескольких коммуникациях повторяется запрос на позицию одной категории.", status: "Вывод сформирован" },
];

export const detailFacts = [
  ["Потребность", "Подобрать функционально совместимый аналог отсутствующего товара."],
  ["Возражение", "Клиент сомневается, что предложенный вариант будет доступен в нужный срок."],
  ["Договорённость", "Вернуться с проверенным предложением после сверки каталога и остатков."],
] as const;
