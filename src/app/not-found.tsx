import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center py-32 text-center">
      <h1
        className="text-6xl font-bold"
        style={{ color: "var(--text)" }}
      >
        404
      </h1>
      <h2
        className="mt-4 text-2xl font-semibold"
        style={{ color: "var(--text)" }}
      >
        Страница не найдена
      </h2>
      <p
        className="mt-4 max-w-md text-lg"
        style={{ color: "var(--text-muted)" }}
      >
        Возможно, ссылка устарела или адрес введён с ошибкой. Перейдите на главную или
        посмотрите кейсы OptiMate.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="btn-primary">
          На главную
        </Link>
        <Link href="/work" className="btn-secondary">
          Смотреть кейсы
        </Link>
      </div>
    </section>
  );
}
