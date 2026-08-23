import type { Metadata } from "next";
import { buildMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(PAGE_SEO.cookies);

export default function CookiesPage() {
  return (
    <section className="legal-page py-20 lg:py-28">
      <div className="container">
        <div className="legal-document mx-auto max-w-3xl" style={{ color: "var(--text)" }}>
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            Политика cookie
          </h1>
          <p className="mt-4 text-sm" style={{ color: "var(--text-soft)" }}>
            Дата последнего обновления: 02.07.2026
          </p>

          <div className="mt-8 space-y-6 text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>1. Что такое cookie</h2>
              <p>
                Cookie — небольшие текстовые файлы, которые сохраняются в браузере при посещении
                сайта. Они помогают сайту запоминать ваши действия и предпочтения.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>2. Какие cookie используются</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Необходимые:</strong> cookie для работы сессии и безопасности. Не требуют
                  согласия.
                </li>
                <li>
                  <strong>Аналитические:</strong> cookie для Яндекс Метрики. Включаются только после
                  вашего согласия.
                </li>
                <li>
                  <strong>Настройки:</strong> cookie для сохранения выбора темы и согласий.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>3. Как управлять cookie</h2>
              <p>
                Вы можете изменить настройки cookie через баннер внизу экрана или очистить cookie
                через настройки браузера. Отключение необходимых cookie может повлиять на работу
                сайта.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>4. Сторонние сервисы</h2>
              <p>
                При вашем согласии сайт может загружать скрипты Яндекс Метрики. Ознакомьтесь с
                политикой конфиденциальности Яндекса: https://yandex.ru/legal/confidential/
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>5. Контакты</h2>
              <p>
                По вопросам использования cookie обращайтесь: info@optimatesite.ru
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
