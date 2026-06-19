const { description } = require('../../package')

const sidebar =require ('./public/sidebar.json')

module.exports = {
  title: 'Crono',
  description: description,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/images/logo.png' }],
    ['meta', { name: 'theme-color', content: '#007bcc' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  themeConfig: {
    navbar: false,
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [],
    sidebarDepth: 0,
    sidebar: false
  },
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
