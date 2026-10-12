import { For, Show } from "solid-js";
import { getHostname } from "~/lib/resume/get-hostname";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { formatModernSplitDate } from "../format-date";
import { AwardIcon } from "../icons";
import { ModernSplitSection } from "../ModernSplitSection";
import type { ThemeTokens } from "../tokens";

interface CertificationsSectionProps {
  certifications: ResumeDocument["certifications"];
  label: string;
  tokens: ThemeTokens;
  visible: boolean;
}

function issuerMetaLine(issuer: string, date: string | null): string {
  const dateLabel = date ? formatModernSplitDate(date) : "";
  return dateLabel ? `${issuer} (${dateLabel})` : issuer;
}

export function CertificationsSection(props: CertificationsSectionProps) {
  if (!props.visible || props.certifications.length === 0) return null;

  return (
    <ModernSplitSection label={props.label} tokens={props.tokens}>
      <div class={`flex flex-col ${props.tokens.itemGap}`}>
        <For each={props.certifications}>
          {(cert) => {
            const metaText = issuerMetaLine(cert.issuer, cert.date);
            return (
              <div>
                <div class="flex items-center gap-1">
                  <AwardIcon size={10} style={{ color: props.tokens.accent }} />
                  <span class={`${props.tokens.typography.body} font-semibold text-gray-800`}>
                    {cert.name}
                  </span>
                </div>
                <span class={`${props.tokens.typography.meta} text-gray-500 ml-4 block`}>
                  {metaText}
                  <Show when={cert.url}>
                    <>
                      {" · "}
                      <a
                        href={cert.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="hover:underline"
                        style={{ color: props.tokens.accent }}
                      >
                        {getHostname(cert.url!)}
                      </a>
                    </>
                  </Show>
                </span>
              </div>
            );
          }}
        </For>
      </div>
    </ModernSplitSection>
  );
}
