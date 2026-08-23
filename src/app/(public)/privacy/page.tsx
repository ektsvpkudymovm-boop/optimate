import type { Metadata } from "next";
import { buildMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(PAGE_SEO.privacy);

export default function PrivacyPage() {
  return (
    <section className="legal-page py-20 lg:py-28">
      <div className="container">
        <div className="legal-document mx-auto max-w-3xl prose" style={{ color: "var(--text)" }}>
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            Политика обработки персональных данных
          </h1>
          <p className="mt-4 text-sm" style={{ color: "var(--text-soft)" }}>
            Дата последнего обновления: 02.07.2026
          </p>

          <div className="mt-8 space-y-6 text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>1. Общие положения</h2>
              <p>
                Настоящая Политика обработки персональных данных определяет порядок обработки
                персональных данных, собираемых через сайт OptiMate (далее — «Сайт»). Использование
                Сайта означает безоговорочное согласие Пользователя с настоящей Политикой.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>2. Оператор персональных данных</h2>
              <p>
                [Наименование юридического лица / ИП]<br />
                [ИНН / ОГРН]<br />
                [Юридический адрес]<br />
                Email: info@optimatesite.ru
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>3. Какие персональные данные обрабатываются</h2>
              <p>Сайт может собирать следующие персональные данные:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Имя;</li>
                <li>Контакт (Telegram, телефон, email);</li>
                <li>Компания / проект;</li>
                <li>Описание задачи;</li>
                <li>UTM-метки, referrer, URL страницы, user agent;</li>
                <li>Факт и время дачи согласия на обработку ПДн.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>4. Цели обработки</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Обработка заявки и связь с заявителем;</li>
                <li>Подготовка предложения по автоматизации;</li>
                <li>Аналитика использования Сайта;</li>
                <li>Обеспечение работы Сайта и безопасность.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>5. Правовые основания</h2>
              <p>
                Обработка персональных данных осуществляется на основании согласия субъекта
                персональных данных (ст. 9, 152-ФЗ) и для связи по инициативе субъекта.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>6. Сроки обработки</h2>
              <p>
                Персональные данные обрабатываются в течение срока, необходимого для обработки
                заявки, но не более 3 лет с момента последнего взаимодействия, если иное не
                предусмотрено законодательством.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>7. Права субъекта</h2>
              <p>Субъект персональных данных имеет право:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Получать информацию об обработке своих ПДн;</li>
                <li>Требовать уточнения, блокирования или уничтожения ПДн;</li>
                <li>Отозвать согласие на обработку ПДн;</li>
                <li>Обжаловать действия оператора в Роскомнадзоре.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>8. Контакты</h2>
              <p>
                По вопросам обработки персональных данных обращайтесь: info@optimatesite.ru
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
