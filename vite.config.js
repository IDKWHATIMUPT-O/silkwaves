import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const projectDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Resolved from the project directory rather than process.cwd(), so the flag
  // is read correctly even when vite is launched from somewhere else.
  const env = loadEnv(mode, projectDir, "");
  const comingSoon = env.VITE_COMING_SOON === "true";

  // index.html loads Razorpay's checkout script for the storefront. On the
  // countdown there is nothing to pay for, so serving it would only make
  // visitors fetch a third-party script and let it inject its badge into the
  // page. Strip it out of coming-soon builds.
  const stripCheckoutScript = {
    name: "silkwaves-strip-checkout-script",
    transformIndexHtml(html) {
      return html.replace(
        /\s*<script[^>]*checkout\.razorpay\.com[^>]*>\s*<\/script>/i,
        "",
      );
    },
  };

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(comingSoon ? [stripCheckoutScript] : []),
    ],
    server: {
      host: "localhost",
      port: 5174,
    },
  };
});
