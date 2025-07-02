// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)



import configJson from './docusaurus.json';
require.resolve('./docusaurus.json');

const config = {
    ...configJson.config,
    url: 'https://docusaurus.io',
    baseUrl: '/',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },
    stylesheets: [
        {
            href: 'https://cdn3.devexpress.com/jslib/23.2.3/css/dx.light.css',
            type: 'text/css',
            id: 'devexpress-theme',
        },
    ],
    scripts: [
        {
            src: 'https://cdn3.devexpress.com/jslib/23.2.3/js/dx.all.js',
            async: false,
        },
        {
            src: '/js/devexpress-theme-switcher.js',
            async: true,
            defer: true,
        },
    ],

    presets: [
        [
            '@docusaurus/preset-classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    routeBasePath: '/', // Serve the docs at the site's root
                    sidebarPath: './sidebars.js',
                    path: '../crono.org-origin', // Leer documentos desde la carpeta origin
                },
                blog: false
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: 'img/docusaurus-social-card.jpg',
            navbar: configJson.navbar,
            prism: {
                theme: prismThemes.vsLight,
                darkTheme: prismThemes.vsDark,
            },
        }),
};




export default config;
