import { For, Show } from "solid-js";
import { getHostname } from "~/lib/resume/get-hostname";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import {
  GitHubIcon,
  GitLabIcon,
  GlobeIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "../icons";
import type { ThemeTokens } from "../tokens";

const CONTACT_ICON_SIZE = 12;

interface ContactBlockProps {
  personal: ResumeDocument["personal"];
  tokens: ThemeTokens;
}

const LINK_KIND_ORDER = ["website", "linkedin", "github", "gitlab"] as const;

export function ContactBlock(props: ContactBlockProps) {
  const { personal, tokens } = props;
  const typography = () => tokens.typography;
  const linkClass = () => `hover:underline ${typography().meta}`;
  const linkStyle = () => ({ color: tokens.accent });
  const itemClass = "flex items-center gap-2";
  const containerClass = `flex flex-col ${tokens.contactStackGap} text-gray-700`;

  const orderedLinks = () =>
    LINK_KIND_ORDER.flatMap((kind) =>
      personal.links.filter((l) => l.kind === kind),
    );

  const renderIcon = (icon: () => ReturnType<typeof MailIcon>) => (
    <Show when={tokens.showIcons}>
      <span class="shrink-0" style={{ color: tokens.accent }}>{icon()}</span>
    </Show>
  );

  return (
    <div class={containerClass}>
      <Show when={personal.email}>
        <div class={itemClass}>
          {renderIcon(() => <MailIcon size={CONTACT_ICON_SIZE} />)}
          <a href={`mailto:${personal.email}`} class={linkClass()} style={linkStyle()}>
            {personal.email}
          </a>
        </div>
      </Show>
      <Show when={personal.phone}>
        <div class={itemClass}>
          {renderIcon(() => <PhoneIcon size={CONTACT_ICON_SIZE} />)}
          <span class={typography().meta}>{personal.phone}</span>
        </div>
      </Show>
      <Show when={personal.location}>
        <div class={itemClass}>
          {renderIcon(() => <MapPinIcon size={CONTACT_ICON_SIZE} />)}
          <span class={typography().meta}>{personal.location}</span>
        </div>
      </Show>
      <For each={orderedLinks()}>
        {(link) => {
          const Icon =
            link.kind === "linkedin"
              ? LinkedInIcon
              : link.kind === "github"
                ? GitHubIcon
                : link.kind === "gitlab"
                  ? GitLabIcon
                  : GlobeIcon;
          return (
            <div class={itemClass}>
              {renderIcon(() => <Icon size={CONTACT_ICON_SIZE} />)}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                class={linkClass()}
                style={linkStyle()}
              >
                {getHostname(link.url)}
              </a>
            </div>
          );
        }}
      </For>
    </div>
  );
}
