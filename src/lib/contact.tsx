import {
  createContext,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import { getContactQuery } from "~/lib/api/public-queries";
import { usePublicQueryResource } from "~/lib/api/use-public-query";
import type { ContactData } from "~/lib/api/types/portfolio.types";

type ContactResource = ReturnType<typeof usePublicQueryResource<ContactData | null>>;

interface ContactContextValue {
  resource: ContactResource;
  email: Accessor<string | null>;
  phone: Accessor<string | null>;
  location: Accessor<string | null>;
  gpgKey: Accessor<string | null>;
  socialLinks: Accessor<ContactData["socialLinks"]>;
}

const ContactContext = createContext<ContactContextValue>();

export function ContactProvider(props: ParentProps) {
  const resource = usePublicQueryResource(() => getContactQuery());

  const data = () => resource.data();

  const email = () => data()?.email?.trim() || null;
  const phone = () => data()?.phone?.trim() || null;
  const location = () => data()?.location?.trim() || null;
  const gpgKey = () => data()?.gpgKey?.trim() || null;
  const socialLinks = () => data()?.socialLinks ?? [];

  const value: ContactContextValue = {
    resource,
    email,
    phone,
    location,
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
