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
        defaultLocale: 'es',
        locales: ['es'],
    },
    stylesheets: [
        {
            href: 'https://cdn3.devexpress.com/jslib/23.2.3/css/dx.light.css',
            type: 'text/css',
            id: 'devexpress-theme',
        },
        '/css/navbar-logo.css',
        '/css/custom.css',
    ],
    // El CSS personalizado se configura en el preset
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
                    sidebarPath: './sidebars.js'
                },
                blog: false,
                theme: {
                    customCss: [
                        require.resolve('./src/css/custom-dark.css'),
                        require.resolve('./src/css/global.css'),
                    ],
                }
            }),
        ],
    ],

    plugins: [
        [
            require.resolve('@easyops-cn/docusaurus-search-local'),
            {
                hashed: true,
                language: ['es', 'en'],
                highlightSearchTermsOnTargetPage: true,
                explicitSearchResultPath: true,
                docsRouteBasePath: '/',
            },
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: 'img/docusaurus-social-card.jpg',
            favicon: 'images/logo-mini-crono-black.png',
            navbar: configJson.navbar,
            prism: {
                theme: prismThemes.vsLight,
                darkTheme: prismThemes.vsDark,
            },
        }),
};




export default config;
