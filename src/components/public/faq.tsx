"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Вы делаете только AI-проекты?",
    a: "Нет. Мы собираем рабочие digital-системы: интерфейсы, CRM, автоматизации, базы знаний, контентные конвейеры и AI-агентов. AI подключается там, где он действительно помогает процессу.",
  },
  {
    q: "Можно начать с маленькой задачи?",
    a: "Да. Чаще всего мы начинаем с одного процесса: заявки, документы, CRM, контент, каталог, коммуникации или отчёты. После разбора предлагаем 1–3 сценария с разным уровнем сложности.",
  },
  {
    q: "Вы можете подключить наши текущие сервисы?",
    a: "Да. Мы можем связать сайт, CRM, таблицы, Telegram, 1C, API, базы знаний, n8n/Make и другие сервисы. Конкретный контур зависит от текущей инфраструктуры.",
  },
  {
    q: "Как вы контролируете качество AI-ответов?",
    a: "Мы не строим систему, где AI бесконтрольно принимает решения. Используем источники, проверки, черновики, ручное подтверждение, журнал действий и понятные зоны ответственности человека.",
  },
  {
    q: "Сайт и формы будут соответствовать требованиям РФ?",
    a: "Для MVP закладываем юридические страницы, согласия, обработку персональных данных, cookie consent и осторожные формулировки без обещаний гарантированного результата.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={i}
          className="faq-row"
          data-open={openIndex === i}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="faq-row__button"
            aria-expanded={openIndex === i}
            aria-controls={`home-faq-answer-${i}`}
          >
            <span>{item.q}</span>
            <ChevronDown
              className="faq-row__icon"
              aria-hidden="true"
            />
          </button>
          <div
            id={`home-faq-answer-${i}`}
            className="faq-row__body"
            aria-hidden={openIndex !== i}
          >
            <div className="faq-row__body-inner">
              {item.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
