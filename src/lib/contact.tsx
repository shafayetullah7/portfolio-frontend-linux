import {
  createContext,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import { useClientResource } from "~/lib/api/client-resource";
import { getContact } from "~/lib/api/endpoints/public";
import type { ContactData } from "~/lib/api/types/portfolio.types";

type ContactResource = ReturnType<typeof useClientResource<ContactData | null>>;

interface ContactContextValue {
  resource: ContactResource;
  email: Accessor<string | null>;
  gpgKey: Accessor<string | null>;
  socialLinks: Accessor<ContactData["socialLinks"]>;
}

const ContactContext = createContext<ContactContextValue>();

export function ContactProvider(props: ParentProps) {
  const resource = useClientResource(() => getContact());

  const data = () => resource.data();

  const email = () => data()?.email?.trim() || null;
  const gpgKey = () => data()?.gpgKey?.trim() || null;
  const socialLinks = () => data()?.socialLinks ?? [];

  const value: ContactContextValue = {
    resource,
    email,
    gpgKey,
    socialLinks,
  };

  return (
    <ContactContext.Provider value={value}>{props.children}</ContactContext.Provider>
  );
}

export function useContact() {
  const ctx = useContext(ContactContext);
  if (!ctx) {
    throw new Error("useContact must be used within ContactProvider");
  }
  return ctx;
}
