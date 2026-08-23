import type { Metadata } from "next";
import { buildMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(PAGE_SEO.consent);

export default function ConsentPage() {
  return (
    <section className="legal-page py-20 lg:py-28">
      <div className="container">
        <div className="legal-document mx-auto max-w-3xl" style={{ color: "var(--text)" }}>
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            Согласие на обработку персональных данных
          </h1>
          <p className="mt-4 text-sm" style={{ color: "var(--text-soft)" }}>
            Дата: 02.07.2026 · Версия: 1.0
          </p>

          <div className="mt-8 space-y-6 text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <p>
              Я, заполнив форму обратной связи на сайте OptiMate, даю своё согласие
              [Наименование юридического лица / ИП] (далее — «Оператор») на обработку моих
              персональных данных на следующих условиях:
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>1. Что обрабатывается</h2>
              <p>Имя, контакт (Telegram / телефон / email), компания, описание задачи, UTM-метки, referrer, URL страницы, user agent.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>2. Цели обработки</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Связь с заявителем для обсуждения задачи;</li>
                <li>Подготовка предложения по автоматизации;</li>
                <li>Аналитика эффективности Сайта.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>3. Действия с данными</h2>
              <p>
                Сбор, запись, систематизация, накопление, хранение, уточнение, извлечение,
                использование, обезличивание, удаление, уничтожение.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>4. Срок действия</h2>
              <p>
                Согласие действует с момента отправки формы и до момента отзыва. Отзыв согласия
                осуществляется путём направления письма на info@optimatesite.ru.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>5. Ссылка на Политику</h2>
              <p>
                Ознакомиться с Политикой обработки персональных данных можно по ссылке:{" "}
                <a href="/privacy" style={{ color: "var(--primary)" }} className="underline">
                  /privacy
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
