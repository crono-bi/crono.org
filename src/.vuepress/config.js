const { description } = require('../../package')

const sidebar =require ('./data/sidebar.json')

module.exports = {
  title: 'Crono SQL',
  description: description,
  head: [
    ['meta', { name: 'theme-color', content: '#0000FF' }],
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
        text: 'Introducción',
        link: '/guide/',
      },
      {
        text: 'Lenguaje',
        link: '/language/',
      },
      {
        text: 'Funciones',
        link: '/functions/',
      }
    ],
    sidebar 
  },
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
