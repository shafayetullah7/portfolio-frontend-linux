import { Meta, Title } from "@solidjs/meta";

interface SeoProps {
  title: string;
  description: string;
}

export default function Seo(props: SeoProps) {
  return (
    <>
      <Title>{props.title}</Title>
      <Meta name="description" content={props.description} />
      <Meta property="og:title" content={props.title} />
      <Meta property="og:description" content={props.description} />
      <Meta property="og:type" content="website" />
    </>
  );
}
