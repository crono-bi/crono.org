const { description } = require('../../package')

const sidebar =require ('./public/sidebar.json')

module.exports = {
  title: 'Crono Manuales',
  description: description,
  head: [
    ['meta', { name: 'theme-color', content: '#007bcc' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Crono Analysis',
        link: '/analysis/',
      },
      {
        text: 'Crono Metadata',
        link: '/metadata/',
      },
      {
        text: 'Crono ETL',
        link: '/etl/',
      },
      {
        text: 'Crono SQL',
        link: '/sql/',
      },
      {
        text: 'Empresa 🏛️',
        link: 'https://businessintelligence.es',
      }
    ],
    sidebarDepth: 0,
    sidebar 
  },
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
