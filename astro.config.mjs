// @ts-check
import { defineConfig } from 'astro/config';

// import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

// https://astro.build/config  // output: 'server',integrations: [react()],
export default defineConfig({
 
  adapter: vercel(),
 
  server: {
    allowedHosts: ['sgcf25.shalify.eu.org', 'gcf-acar.vercel.app']
  }
});