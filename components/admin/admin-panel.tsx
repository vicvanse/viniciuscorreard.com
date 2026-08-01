"use client";

import { useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { logoutAdminAction } from "@/app/admin/actions";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import type { HeroAlign, HeroVariant, SiteContent } from "@/lib/site-content";

const HERO_VARIANT_OPTIONS: {
  value: HeroVariant;
  title: string;
  description: string;
}[] = [
  {
    value: "1",
    title: "Versão 1 · Full-bleed",
    description: "Cartão de fundo ocupando a tela toda, com círculo e texto à esquerda.",
  },
  {
    value: "2",
    title: "Versão 2 · Quadro",
    description: "Como no celular: cartão emoldurado acima do texto.",
  },
  {
    value: "3",
    title: "Versão 3 · Intermediária",
    description: "Texto à esquerda e cartão emoldurado à direita.",
  },
  {
    value: "4",
    title: "Versão 4 · Círculo com fundo",
    description:
      "O cartão fica como fundo circular do anel, com Vinicius Correard no centro.",
  },
];

const HERO_ALIGN_OPTIONS: {
  value: HeroAlign;
  title: string;
  description: string;
}[] = [
  {
    value: "left",
    title: "Texto à esquerda",
    description: "Bloco de texto alinhado à esquerda no desktop.",
  },
  {
    value: "center",
    title: "Texto centralizado",
    description: "Bloco de texto e CTAs centralizados no desktop.",
  },
];

interface AdminPanelProps {
  initialContent: SiteContent;
  initiallyAuthenticated: boolean;
  queryError?: string | null;
}

const fieldClass =
  "mt-1 w-full rounded-xl border border-line bg-surface-raised px-3 py-2.5 text-sm text-ink outline-none transition focus:border-white/40";
const labelClass = "block text-sm font-medium text-ink-soft";
const sectionClass = "rounded-2xl border border-line bg-surface p-5 sm:p-6";
const cardClass = "rounded-xl border border-line bg-surface-raised p-4";

export function AdminPanel({
  initialContent,
  initiallyAuthenticated,
  queryError = null,
}: AdminPanelProps) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<
    "portrait" | "gym" | "card" | null
  >(null);

  useEffect(() => {
    startTransition(() => {
      setContent(initialContent);
    });
  }, [initialContent]);

  if (!initiallyAuthenticated) {
    return <AdminLoginForm queryError={queryError} />;
  }

  async function handleMediaUpload(
    slot: "portrait" | "gym" | "card",
    file: File | null,
  ) {
    if (!file) return;
    setUploadingSlot(slot);
    setError(null);
    setStatus(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("slot", slot);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = (await response.json()) as {
        content?: SiteContent;
        error?: string;
      };
      if (!response.ok) {
        setError(data.error || "Falha no upload.");
        return;
      }
      if (data.content) setContent(data.content);
      const labels = {
        portrait: "Foto do Sobre mim",
        gym: "Foto da academia",
        card: "Cartão do hero",
      } as const;
      setStatus(`${labels[slot]} atualizado para todo o site.`);
    } catch {
      setError("Erro ao enviar a imagem.");
    } finally {
      setUploadingSlot(null);
    }
  }

  async function handleMediaRemove(slot: "portrait" | "gym" | "card") {
    setUploadingSlot(slot);
    setError(null);
    setStatus(null);
    try {
      const response = await fetch(
        `/api/admin/upload?slot=${encodeURIComponent(slot)}`,
        { method: "DELETE" },
      );
      const data = (await response.json()) as {
        content?: SiteContent;
        error?: string;
      };
      if (!response.ok) {
        setError(data.error || "Falha ao remover.");
        return;
      }
      if (data.content) setContent(data.content);
      setStatus(
        slot === "card"
          ? "Cartão restaurado para a imagem padrão."
          : "Imagem removida do site.",
      );
    } catch {
      setError("Erro ao remover a imagem.");
    } finally {
      setUploadingSlot(null);
    }
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    setStatus(null);
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = (await response.json()) as {
        content?: SiteContent;
        error?: string;
      };
      if (!response.ok) {
        setError(data.error || "Não foi possível salvar.");
        return;
      }
      if (data.content) setContent(data.content);
      setStatus("Textos salvos. A home já reflete as alterações.");
    } catch {
      setError("Erro ao salvar.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Editar site</h1>
          <p className="mt-2 text-sm text-muted">
            Textos, fotos do Sobre mim e cartão do hero. Alterações aparecem para
            todos os visitantes.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-white/30 hover:text-ink"
          >
            Ver site
          </Link>
          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-white/30 hover:text-ink"
            >
              Sair
            </button>
          </form>
        </div>
      </div>

      <section className={`${sectionClass} mt-8`}>
        <h2 className="font-display text-xl text-ink">Fotos e cartão</h2>
        <p className="mt-2 text-sm text-muted">
          JPG, PNG ou WebP (até 4 MB). Adicione, substitua ou remova cada imagem.
        </p>
        <div className="mt-5 space-y-5">
          <MediaSlotEditor
            title="Foto do Sobre mim"
            description="Quadro principal. Sem foto, o site usa a marca circular."
            src={content.portraitSrc}
            updatedAt={content.portraitUpdatedAt}
            aspectClass="aspect-[4/5]"
            emptyLabel="Sem foto · marca circular"
            busy={uploadingSlot === "portrait"}
            canRemove={Boolean(content.portraitSrc)}
            removeLabel="Remover foto"
            onUpload={(file) => void handleMediaUpload("portrait", file)}
            onRemove={() => void handleMediaRemove("portrait")}
            fieldClass={fieldClass}
            labelClass={labelClass}
          />
          <MediaSlotEditor
            title="Foto da academia"
            description="Segunda foto do Sobre mim, ao lado da principal no desktop."
            src={content.gymSrc}
            updatedAt={content.gymUpdatedAt}
            aspectClass="aspect-[4/5]"
            emptyLabel="Sem foto · quadro oculto"
            busy={uploadingSlot === "gym"}
            canRemove={Boolean(content.gymSrc)}
            removeLabel="Remover foto"
            onUpload={(file) => void handleMediaUpload("gym", file)}
            onRemove={() => void handleMediaRemove("gym")}
            fieldClass={fieldClass}
            labelClass={labelClass}
          />
          <MediaSlotEditor
            title="Cartão do hero"
            description="Usado nas versões 1–4 do hero (fundo, quadro e círculo)."
            src={content.cardSrc}
            updatedAt={content.cardUpdatedAt}
            aspectClass="aspect-[16/10]"
            emptyLabel="Cartão padrão"
            busy={uploadingSlot === "card"}
            canRemove={Boolean(content.cardSrc)}
            removeLabel="Restaurar padrão"
            onUpload={(file) => void handleMediaUpload("card", file)}
            onRemove={() => void handleMediaRemove("card")}
            fieldClass={fieldClass}
            labelClass={labelClass}
          />
        </div>
        {uploadingSlot ? (
          <p className="mt-3 text-sm text-ink-soft">Atualizando imagem…</p>
        ) : null}
      </section>

      <form onSubmit={handleSave} className="mt-6 space-y-6">
        <section className={sectionClass}>
          <h2 className="font-display text-xl text-ink">Identidade</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Nome (marca)
              <input
                className={fieldClass}
                value={content.name}
                onChange={(e) => setContent({ ...content, name: e.target.value })}
              />
            </label>
            <label className={labelClass}>
              Nome completo
              <input
                className={fieldClass}
                value={content.fullName}
                onChange={(e) =>
                  setContent({ ...content, fullName: e.target.value })
                }
              />
            </label>
            <label className={labelClass}>
              Título profissional
              <input
                className={fieldClass}
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
              />
            </label>
            <label className={labelClass}>
              CRN
              <input
                className={fieldClass}
                value={content.crn}
                onChange={(e) => setContent({ ...content, crn: e.target.value })}
              />
            </label>
            <label className={labelClass}>
              Telefone
              <input
                className={fieldClass}
                value={content.phone}
                onChange={(e) => setContent({ ...content, phone: e.target.value })}
              />
            </label>
            <label className={labelClass}>
              E-mail
              <input
                className={fieldClass}
                value={content.email}
                onChange={(e) => setContent({ ...content, email: e.target.value })}
              />
            </label>
            <label className={labelClass}>
              Instagram (URL completa)
              <input
                className={fieldClass}
                placeholder="https://www.instagram.com/usuario"
                value={content.instagramUrl}
                onChange={(e) =>
                  setContent({ ...content, instagramUrl: e.target.value })
                }
              />
            </label>
            <label className={labelClass}>
              WhatsApp (URL wa.me)
              <input
                className={fieldClass}
                value={content.whatsappUrl}
                onChange={(e) =>
                  setContent({ ...content, whatsappUrl: e.target.value })
                }
              />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Texto do botão do topo
              <input
                className={fieldClass}
                value={content.whatsappLabel}
                onChange={(e) =>
                  setContent({ ...content, whatsappLabel: e.target.value })
                }
              />
            </label>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="font-display text-xl text-ink">Hero</h2>
          <div className="mt-4 space-y-4">
            <fieldset>
              <legend className={labelClass}>Layout no computador</legend>
              <p className="mt-1 text-sm text-muted">
                No celular o layout permanece o cartão emoldurado acima do texto.
                Escolha a versão do desktop e salve.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {HERO_VARIANT_OPTIONS.map((option) => {
                  const isSelected = (content.heroVariant ?? "1") === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`cursor-pointer rounded-xl border p-3 transition ${
                        isSelected
                          ? "border-white/50 bg-white/5 ring-1 ring-white/40"
                          : "border-line bg-surface-raised hover:border-white/25"
                      }`}
                    >
                      <input
                        type="radio"
                        name="heroVariant"
                        value={option.value}
                        checked={isSelected}
                        className="sr-only"
                        onChange={() =>
                          setContent({
                            ...content,
                            heroVariant: option.value,
                          })
                        }
                      />
                      <HeroVariantPreview variant={option.value} active={isSelected} />
                      <p className="mt-2.5 text-sm font-medium text-ink">
                        {option.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted">
                        {option.description}
                      </p>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <fieldset>
              <legend className={labelClass}>Alinhamento do texto (desktop)</legend>
              <p className="mt-1 text-sm text-muted">
                Escolha se o texto do hero fica à esquerda ou centralizado no
                computador. No celular o layout não muda.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {HERO_ALIGN_OPTIONS.map((option) => {
                  const isSelected = (content.heroAlign ?? "left") === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`cursor-pointer rounded-xl border p-3 transition ${
                        isSelected
                          ? "border-white/50 bg-white/5 ring-1 ring-white/40"
                          : "border-line bg-surface-raised hover:border-white/25"
                      }`}
                    >
                      <input
                        type="radio"
                        name="heroAlign"
                        value={option.value}
                        checked={isSelected}
                        className="sr-only"
                        onChange={() =>
                          setContent({
                            ...content,
                            heroAlign: option.value,
                          })
                        }
                      />
                      <HeroAlignPreview align={option.value} active={isSelected} />
                      <p className="mt-2.5 text-sm font-medium text-ink">
                        {option.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted">
                        {option.description}
                      </p>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                content.showCircleMark !== false
                  ? "border-white/50 bg-white/5 ring-1 ring-white/40"
                  : "border-line bg-surface-raised hover:border-white/25"
              }`}
            >
              <input
                type="checkbox"
                className="mt-1 size-4 rounded border-line accent-white"
                checked={content.showCircleMark !== false}
                onChange={(e) =>
                  setContent({
                    ...content,
                    showCircleMark: e.target.checked,
                  })
                }
              />
              <span>
                <span className="block text-sm font-medium text-ink">
                  Exibir círculo (marca animada)
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">
                  Mostra o anel com Vinicius Correard / Nutricionista no hero.
                  Vale para desktop e celular.
                </span>
              </span>
            </label>
            <label className={labelClass}>
              Eyebrow
              <input
                className={fieldClass}
                value={content.hero.eyebrow}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, eyebrow: e.target.value },
                  })
                }
              />
            </label>
            <label className={labelClass}>
              Headline
              <input
                className={fieldClass}
                value={content.hero.headline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, headline: e.target.value },
                  })
                }
              />
            </label>
            <label className={labelClass}>
              Texto de apoio
              <textarea
                rows={3}
                className={fieldClass}
                value={content.hero.support}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, support: e.target.value },
                  })
                }
              />
            </label>
            <label className={labelClass}>
              Texto do botão
              <input
                className={fieldClass}
                value={content.hero.cta}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, cta: e.target.value },
                  })
                }
              />
            </label>
            <label className={labelClass}>
              Legenda dentro do círculo
              <input
                className={fieldClass}
                value={content.hero.circleSubtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, circleSubtitle: e.target.value },
                  })
                }
              />
            </label>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="font-display text-xl text-ink">Situações</h2>
          <label className={`${labelClass} mt-4`}>
            Título da seção
            <input
              className={fieldClass}
              value={content.situations.heading}
              onChange={(e) =>
                setContent({
                  ...content,
                  situations: { ...content.situations, heading: e.target.value },
                })
              }
            />
          </label>
          <div className="mt-4 space-y-5">
            {content.situations.items.map((item, index) => (
              <div key={index} className={cardClass}>
                <p className="text-xs font-medium tracking-wide text-muted uppercase">
                  Item {index + 1}
                </p>
                <label className={`${labelClass} mt-3`}>
                  Título
                  <input
                    className={fieldClass}
                    value={item.title}
                    onChange={(e) => {
                      const items = [...content.situations.items];
                      items[index] = { ...item, title: e.target.value };
                      setContent({
                        ...content,
                        situations: { ...content.situations, items },
                      });
                    }}
                  />
                </label>
                <label className={`${labelClass} mt-3`}>
                  Descrição
                  <textarea
                    rows={3}
                    className={fieldClass}
                    value={item.description}
                    onChange={(e) => {
                      const items = [...content.situations.items];
                      items[index] = { ...item, description: e.target.value };
                      setContent({
                        ...content,
                        situations: { ...content.situations, items },
                      });
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
          <label className={`${labelClass} mt-4`}>
            Texto de fechamento
            <textarea
              rows={2}
              className={fieldClass}
              value={content.situations.closing}
              onChange={(e) =>
                setContent({
                  ...content,
                  situations: { ...content.situations, closing: e.target.value },
                })
              }
            />
          </label>
        </section>

        <section className={sectionClass}>
          <h2 className="font-display text-xl text-ink">Sobre mim</h2>
          <label className={`${labelClass} mt-4`}>
            Título
            <input
              className={fieldClass}
              value={content.about.heading}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, heading: e.target.value },
                })
              }
            />
          </label>
          {content.about.paragraphs.map((paragraph, index) => (
            <label key={index} className={`${labelClass} mt-4`}>
              Parágrafo {index + 1}
              <textarea
                rows={3}
                className={fieldClass}
                value={paragraph}
                onChange={(e) => {
                  const paragraphs = [...content.about.paragraphs];
                  paragraphs[index] = e.target.value;
                  setContent({
                    ...content,
                    about: { ...content.about, paragraphs },
                  });
                }}
              />
            </label>
          ))}
        </section>

        <section className={sectionClass}>
          <h2 className="font-display text-xl text-ink">Primeiro encontro</h2>
          <label className={`${labelClass} mt-4`}>
            Título
            <input
              className={fieldClass}
              value={content.firstMeeting.heading}
              onChange={(e) =>
                setContent({
                  ...content,
                  firstMeeting: {
                    ...content.firstMeeting,
                    heading: e.target.value,
                  },
                })
              }
            />
          </label>
          {content.firstMeeting.paragraphs.map((paragraph, index) => (
            <label key={index} className={`${labelClass} mt-4`}>
              Parágrafo {index + 1}
              <textarea
                rows={3}
                className={fieldClass}
                value={paragraph}
                onChange={(e) => {
                  const paragraphs = [...content.firstMeeting.paragraphs];
                  paragraphs[index] = e.target.value;
                  setContent({
                    ...content,
                    firstMeeting: { ...content.firstMeeting, paragraphs },
                  });
                }}
              />
            </label>
          ))}
          <label className={`${labelClass} mt-4`}>
            Texto do botão de contato
            <input
              className={fieldClass}
              value={content.contactCtaLabel}
              onChange={(e) =>
                setContent({ ...content, contactCtaLabel: e.target.value })
              }
            />
          </label>
        </section>

        <section className={sectionClass}>
          <h2 className="font-display text-xl text-ink">Atendimento</h2>
          <label className={`${labelClass} mt-4`}>
            Título
            <input
              className={fieldClass}
              value={content.care.heading}
              onChange={(e) =>
                setContent({
                  ...content,
                  care: { ...content.care, heading: e.target.value },
                })
              }
            />
          </label>
          {content.care.paragraphs.map((paragraph, index) => (
            <label key={index} className={`${labelClass} mt-4`}>
              Parágrafo {index + 1}
              <textarea
                rows={3}
                className={fieldClass}
                value={paragraph}
                onChange={(e) => {
                  const paragraphs = [...content.care.paragraphs];
                  paragraphs[index] = e.target.value;
                  setContent({
                    ...content,
                    care: { ...content.care, paragraphs },
                  });
                }}
              />
            </label>
          ))}
          {content.care.facts.map((fact, index) => (
            <div key={index} className={`${cardClass} mt-4`}>
              <p className="text-xs font-medium tracking-wide text-muted uppercase">
                Destaque {index + 1}
              </p>
              <label className={`${labelClass} mt-3`}>
                Título
                <input
                  className={fieldClass}
                  value={fact.title}
                  onChange={(e) => {
                    const facts = [...content.care.facts];
                    facts[index] = { ...fact, title: e.target.value };
                    setContent({
                      ...content,
                      care: { ...content.care, facts },
                    });
                  }}
                />
              </label>
              <label className={`${labelClass} mt-3`}>
                Descrição
                <textarea
                  rows={2}
                  className={fieldClass}
                  value={fact.description}
                  onChange={(e) => {
                    const facts = [...content.care.facts];
                    facts[index] = { ...fact, description: e.target.value };
                    setContent({
                      ...content,
                      care: { ...content.care, facts },
                    });
                  }}
                />
              </label>
            </div>
          ))}
        </section>

        <section className={sectionClass}>
          <h2 className="font-display text-xl text-ink">FAQ</h2>
          <label className={`${labelClass} mt-4`}>
            Título da seção
            <input
              className={fieldClass}
              value={content.faq.heading}
              onChange={(e) =>
                setContent({
                  ...content,
                  faq: { ...content.faq, heading: e.target.value },
                })
              }
            />
          </label>
          {content.faq.items.map((item, index) => (
            <div key={index} className={`${cardClass} mt-4`}>
              <p className="text-xs font-medium tracking-wide text-muted uppercase">
                Pergunta {index + 1}
              </p>
              <label className={`${labelClass} mt-3`}>
                Pergunta
                <input
                  className={fieldClass}
                  value={item.question}
                  onChange={(e) => {
                    const items = [...content.faq.items];
                    items[index] = { ...item, question: e.target.value };
                    setContent({
                      ...content,
                      faq: { ...content.faq, items },
                    });
                  }}
                />
              </label>
              <label className={`${labelClass} mt-3`}>
                Resposta
                <textarea
                  rows={4}
                  className={fieldClass}
                  value={item.answer}
                  onChange={(e) => {
                    const items = [...content.faq.items];
                    items[index] = { ...item, answer: e.target.value };
                    setContent({
                      ...content,
                      faq: { ...content.faq, items },
                    });
                  }}
                />
              </label>
            </div>
          ))}
        </section>

        <section className={sectionClass}>
          <h2 className="font-display text-xl text-ink">CTA final e rodapé</h2>
          <label className={`${labelClass} mt-4`}>
            Título do CTA
            <textarea
              rows={2}
              className={fieldClass}
              value={content.finalCta.heading}
              onChange={(e) =>
                setContent({
                  ...content,
                  finalCta: { ...content.finalCta, heading: e.target.value },
                })
              }
            />
          </label>
          <label className={`${labelClass} mt-4`}>
            Texto de apoio
            <textarea
              rows={2}
              className={fieldClass}
              value={content.finalCta.support}
              onChange={(e) =>
                setContent({
                  ...content,
                  finalCta: { ...content.finalCta, support: e.target.value },
                })
              }
            />
          </label>
          <label className={`${labelClass} mt-4`}>
            Texto do botão final
            <input
              className={fieldClass}
              value={content.finalCtaLabel}
              onChange={(e) =>
                setContent({ ...content, finalCtaLabel: e.target.value })
              }
            />
          </label>
          <label className={`${labelClass} mt-4`}>
            Copyright no rodapé
            <input
              className={fieldClass}
              value={content.footer.copyright}
              onChange={(e) =>
                setContent({
                  ...content,
                  footer: { copyright: e.target.value },
                })
              }
            />
          </label>
          <label className={`${labelClass} mt-4`}>
            Título SEO
            <input
              className={fieldClass}
              value={content.metadata.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  metadata: { ...content.metadata, title: e.target.value },
                })
              }
            />
          </label>
          <label className={`${labelClass} mt-4`}>
            Descrição SEO
            <textarea
              rows={2}
              className={fieldClass}
              value={content.metadata.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  metadata: { ...content.metadata, description: e.target.value },
                })
              }
            />
          </label>
        </section>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {status ? <p className="text-sm text-ink-soft">{status}</p> : null}

        <button
          type="submit"
          disabled={isBusy}
          className="btn-primary inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-medium disabled:opacity-60"
        >
          {isBusy ? "Salvando…" : "Salvar textos"}
        </button>
      </form>
    </div>
  );
}

function HeroVariantPreview({
  variant,
  active,
}: {
  variant: HeroVariant;
  active: boolean;
}) {
  const frame = active ? "border-white/35" : "border-line";
  return (
    <div
      className={`relative aspect-[16/10] overflow-hidden rounded-lg border bg-canvas ${frame}`}
      aria-hidden
    >
      {variant === "1" ? (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(120deg,#2a2a2a_0%,#141414_45%,#0a0a0a_100%)] opacity-95" />
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <div className="size-10 rounded-full border border-white/70" />
          </div>
          <div className="absolute inset-y-3 left-2 w-[38%] space-y-1">
            <div className="h-1 w-10 rounded bg-white/40" />
            <div className="h-2 w-14 rounded bg-white/70" />
            <div className="h-1 w-16 rounded bg-white/25" />
            <div className="h-1 w-12 rounded bg-white/20" />
          </div>
        </>
      ) : null}
      {variant === "2" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3">
          <div className="h-[42%] w-[72%] rounded-sm bg-[linear-gradient(120deg,#3a3a3a,#1a1a1a)] shadow-sm ring-1 ring-white/20" />
          <div className="h-1.5 w-12 rounded bg-white/70" />
          <div className="h-1 w-16 rounded bg-white/25" />
        </div>
      ) : null}
      {variant === "3" ? (
        <div className="absolute inset-0 grid grid-cols-2 items-center gap-2 px-2.5">
          <div className="space-y-1">
            <div className="h-1 w-8 rounded bg-white/40" />
            <div className="h-2 w-12 rounded bg-white/70" />
            <div className="h-1 w-14 rounded bg-white/25" />
          </div>
          <div className="h-[68%] rounded-sm bg-[linear-gradient(120deg,#3a3a3a,#1a1a1a)] shadow-sm ring-1 ring-white/20" />
        </div>
      ) : null}
      {variant === "4" ? (
        <>
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative size-12 overflow-hidden rounded-full ring-2 ring-white/70">
              <div className="absolute inset-0 bg-[linear-gradient(120deg,#3a3a3a,#1a1a1a)]" />
              <div className="absolute inset-[3px] rounded-full border border-white/35" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-1.5 mx-auto w-[42%] space-y-1">
            <div className="mx-auto h-1 w-10 rounded bg-white/40" />
            <div className="mx-auto h-1.5 w-14 rounded bg-white/70" />
          </div>
        </>
      ) : null}
    </div>
  );
}

function HeroAlignPreview({
  align,
  active,
}: {
  align: HeroAlign;
  active: boolean;
}) {
  const frame = active ? "border-white/35" : "border-line";
  const isCenter = align === "center";
  return (
    <div
      className={`relative aspect-[16/10] overflow-hidden rounded-lg border bg-canvas ${frame}`}
      aria-hidden
    >
      <div
        className={`absolute inset-0 flex flex-col justify-center gap-1 px-3 ${
          isCenter ? "items-center" : "items-start"
        }`}
      >
        <div className={`h-1 rounded bg-white/40 ${isCenter ? "w-10" : "w-8"}`} />
        <div className={`h-2 rounded bg-white/70 ${isCenter ? "w-16" : "w-14"}`} />
        <div className={`h-1 rounded bg-white/25 ${isCenter ? "w-20" : "w-16"}`} />
        <div className={`mt-1 flex gap-1 ${isCenter ? "" : ""}`}>
          <div className="h-2 w-8 rounded-full bg-white/80" />
          <div className="h-2 w-8 rounded-full border border-white/40" />
        </div>
      </div>
    </div>
  );
}

function MediaSlotEditor({
  title,
  description,
  src,
  updatedAt,
  aspectClass,
  emptyLabel,
  busy,
  canRemove,
  removeLabel,
  onUpload,
  onRemove,
  fieldClass,
  labelClass,
}: {
  title: string;
  description: string;
  src: string;
  updatedAt: string;
  aspectClass: string;
  emptyLabel: string;
  busy: boolean;
  canRemove: boolean;
  removeLabel: string;
  onUpload: (file: File | null) => void;
  onRemove: () => void;
  fieldClass: string;
  labelClass: string;
}) {
  const previewSrc =
    src && updatedAt ? `${src}?v=${encodeURIComponent(updatedAt)}` : src;

  return (
    <div className={cardClass}>
      <h3 className="font-display text-base text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div
          className={`relative w-40 overflow-hidden rounded-xl border border-line bg-canvas ${aspectClass}`}
        >
          {src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={previewSrc}
              alt={`Pré-visualização: ${title}`}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <p className="flex h-full items-center justify-center px-3 text-center text-xs text-muted">
              {emptyLabel}
            </p>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <label className={labelClass}>
            {src ? "Substituir imagem" : "Adicionar imagem"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className={`${fieldClass} file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-black`}
              disabled={busy}
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                onUpload(file);
                event.target.value = "";
              }}
            />
          </label>
          {canRemove ? (
            <button
              type="button"
              disabled={busy}
              onClick={onRemove}
              className="self-start rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-white/30 hover:text-ink disabled:opacity-50"
            >
              {removeLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
