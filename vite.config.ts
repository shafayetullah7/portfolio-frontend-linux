import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const parityDevVirtualId = "virtual:resume-parity-dev";
const parityDevResolvedId = "\0resume-parity-dev";

function resumeParityDevPlugin(isProd: boolean) {
  return {
    name: "resume-parity-dev",
    resolveId(id: string) {
      if (id === parityDevVirtualId) return parityDevResolvedId;
    },
    load(id: string) {
      if (id !== parityDevResolvedId) return;
      if (isProd) {
        return "export default null;";
      }
      return `import DevParityResumeView from "./src/components/resume/DevParityResumeView.tsx";
export default DevParityResumeView;`;
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.PORT || env.APP_EXTERNAL_PORT || 4012);
  const isProd = mode === "production";

  return {
    server: {
      port,
      strictPort: true,
      fs: { allow: [repoRoot] },
    },
    preview: { port, strictPort: true },
    plugins: [resumeParityDevPlugin(isProd), solidStart(), tailwindcss(), nitro()],
  };
});
