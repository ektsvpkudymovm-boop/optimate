export type CompanyContextSourceId =
  | "customers"
  | "sales"
  | "products"
  | "knowledge"
  | "marketing";

export type CompanyContextSource = {
  id: CompanyContextSourceId;
  index: string;
  title: string;
  fact: string;
  secondary: string;
  contextLabel: string;
  contextText: string;
};

export type CompanyContextOutcome = {
  role: string;
  outcome: string;
};

export const companyContextSources: CompanyContextSource[] = [
  {
    id: "customers",
    index: "01",
    title: "Клиенты",
    fact: "Нужен аналог. Важно подтвердить срок.",
    secondary: "боли, возражения, запросы и жалобы",
    contextLabel: "Клиент",
    contextText: "Клиенту нужна совместимая замена отсутствующего товара и подтверждённый срок.",
  },
  {
    id: "sales",
    index: "02",
    title: "Продажи",
    fact: "Менеджер обещал вернуться с вариантом.",
    secondary: "качество коммуникаций и работа менеджеров",
    contextLabel: "Продажи",
    contextText: "Менеджер договорился вернуться с проверенным вариантом.",
  },
  {
    id: "products",
    index: "03",
    title: "Товары",
    fact: "В каталоге есть несколько совместимых аналогов.",
    secondary: "спрос, аналоги и взаимозаменяемость",
    contextLabel: "Товары",
    contextText: "В каталоге есть несколько совместимых аналогов.",
  },
  {
    id: "knowledge",
    index: "04",
    title: "Сотрудники / знания",
    fact: "Срок необходимо подтвердить перед обещанием клиенту.",
    secondary: "товары, услуги, инструкции и процессы",
    contextLabel: "Знания",
    contextText: "Срок необходимо подтвердить перед обещанием клиенту.",
  },
  {
    id: "marketing",
    index: "05",
    title: "Маркетинг",
    fact: "Подобная потребность уже встречалась раньше — это не единичный запрос.",
    secondary: "реальные формулировки и предложения",
    contextLabel: "Сигнал",
    contextText: "Подобная потребность уже встречалась раньше — это не единичный запрос.",
  },
];

export const companyContextOutcomes: CompanyContextOutcome[] = [
  { role: "Сотруднику", outcome: "готовый ответ" },
  { role: "Менеджеру", outcome: "следующий шаг" },
  { role: "Руководителю", outcome: "управленческий вывод" },
];
