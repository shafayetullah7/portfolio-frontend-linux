import {
  createContext,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import { siteConfig } from "~/content/site.config";
import { useClientResource } from "~/lib/api/client-resource";
import { getProfile } from "~/lib/api/endpoints/public";
import type { ProfileData } from "~/lib/api/types/portfolio.types";
import { useSiteContent } from "~/lib/site-content";

type ProfileResource = ReturnType<typeof useClientResource<ProfileData>>;

interface ProfileContextValue {
  resource: ProfileResource;
  name: Accessor<string>;
  headline: Accessor<string>;
  bio: Accessor<string>;
  avatarUrl: Accessor<string | null>;
}

const ProfileContext = createContext<ProfileContextValue>();

export function ProfileProvider(props: ParentProps) {
  const site = useSiteContent();
  const resource = useClientResource(() => getProfile());

  const data = () => resource.data();

  const name = () => {
    const n = data()?.profile?.name?.trim();
    return n || site.brand();
  };

  const headline = () => {
    const h = data()?.profile?.headline?.trim();
    return h || siteConfig.hero.title;
  };

  const bio = () => {
    const b = data()?.profile?.bio?.trim();
    return b || siteConfig.hero.support;
  };

  const avatarUrl = () => data()?.avatarUrl?.trim() || null;

  const value: ProfileContextValue = {
    resource,
    name,
    headline,
    bio,
    avatarUrl,
  };

  return (
    <ProfileContext.Provider value={value}>{props.children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return ctx;
}
