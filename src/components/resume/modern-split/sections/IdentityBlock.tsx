import type { ResumeDocument } from "~/schemas/resume-document.schema";
import type { ThemeTokens } from "../tokens";
import { ContactBlock } from "./ContactBlock";

interface IdentityBlockProps {
  personal: ResumeDocument["personal"];
  tokens: ThemeTokens;
}

export function IdentityBlock(props: IdentityBlockProps) {
  const { personal, tokens } = props;

  return (
    <div class="border-b border-gray-200 pb-2 mb-2.5">
      <h1
        class={`${tokens.typography.display} font-bold leading-tight`}
        style={{ color: tokens.accent }}
      >
        {personal.fullName || "Your Name"}
      </h1>
      <p
        class={`${tokens.typography.body} font-semibold mt-0.5`}
        style={{ color: tokens.accent }}
      >
        {personal.jobTitle || "Your Job Title"}
      </p>
      <ContactBlock personal={personal} tokens={tokens} />
    </div>
  );
}
