import Link from "next/link";

const fieldClass =
  "mt-1 w-full rounded-xl border border-line bg-surface-raised px-3 py-2.5 text-sm text-ink outline-none transition focus:border-white/40";
const labelClass = "block text-sm font-medium text-ink-soft";

const QUERY_ERRORS: Record<string, string> = {
  password: "Senha incorreta.",
  config:
    "Admin não configurado. Na Vercel, adicione ADMIN_PASSWORD e ADMIN_SESSION_SECRET em Settings → Environment Variables e faça Redeploy.",
  rate: "Muitas tentativas. Aguarde alguns minutos.",
  session: "Não foi possível criar a sessão.",
  invalid: "Pedido inválido.",
};

interface AdminLoginFormProps {
  queryError?: string | null;
}

export function AdminLoginForm({ queryError }: AdminLoginFormProps) {
  const error = queryError
    ? QUERY_ERRORS[queryError] || "Não foi possível entrar."
    : null;

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="font-display text-3xl text-ink">Área do administrador</h1>

      <form
        method="post"
        action="/api/admin/login"
        className="mt-8 space-y-4"
      >
        <label className={labelClass}>
          Senha
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            className={fieldClass}
            required
          />
        </label>
        {error ? (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="btn-primary inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium"
        >
          Entrar
        </button>
      </form>
      <Link href="/" className="mt-6 inline-block text-sm text-muted hover:text-ink">
        Voltar ao site
      </Link>
    </div>
  );
}
