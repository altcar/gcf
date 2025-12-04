// @ts-check
import { defineConfig } from 'astro/config';

// import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

// https://astro.build/config integrations: [react()],
export default defineConfig({
 
  adapter: vercel(),
  output: 'server',
  server: {
    allowedHosts: ['sgcf25.shalify.eu.org', 'hello.example.local']
  }
});