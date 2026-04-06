/**
 * Genera el astro.config.mjs final con el sidebar convertido.
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const sidebarContent = readFileSync(join(root, 'scripts/sidebar-output.js'), 'utf8').trim();

const config = `// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
\tintegrations: [
\t\tstarlight({
\t\t\ttitle: 'Manual de usuario',
\t\t\tdefaultLocale: 'es',
\t\t\tlocales: { root: { label: 'Español', lang: 'es' } },
\t\t\tsocial: [{ icon: 'external', label: 'Crono', href: 'https://businessintelligence.es' }],
\t\t\t${sidebarContent}
\t\t}),
\t],
});
`;

writeFileSync(join(root, 'astro/astro.config.mjs'), config, 'utf8');
console.log('✅ astro.config.mjs generado');
