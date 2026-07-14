import { defineConfig, loadEnv } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.PORT || env.APP_EXTERNAL_PORT || 4012);

  return {
    server: { port, strictPort: true },
    preview: { port, strictPort: true },
    plugins: [solidStart(), tailwindcss(), nitro()],
  };
});
