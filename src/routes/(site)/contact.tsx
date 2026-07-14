import { Container, SectionHeader } from "~/components/ui";

export default function ContactStubPage() {
  return (
    <Container class="py-16">
      <SectionHeader
        title="Contact.Me()"
        caption="Coming next phase — form will POST to /api/v1/public/contact/submit."
      />
    </Container>
  );
}
