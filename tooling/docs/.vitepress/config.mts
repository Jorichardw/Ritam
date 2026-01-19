import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Ritam Sovereign Language",
  description: "A universal, native-language functional programming language for the web",
  themeConfig: {
    logo: '/banner.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/QUICKSTART' },
      { text: 'Specification', link: '/SPECIFICATION' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/README' },
          { text: 'Quick Start', link: '/QUICKSTART' },
          { text: 'Roadmap', link: '/ROADMAP' }
        ]
      },
      {
        text: 'Language Reference',
        items: [
          { text: 'Specification', link: '/SPECIFICATION' },
          { text: 'Types & Variables', link: '/TYPES' },
          { text: 'Semantics', link: '/SEMANTICS' },
          { text: 'EBNF Grammar', link: '/EBNF' },
          { text: 'Target Languages', link: '/LANGUAGES' }
        ]
      },
      {
        text: 'Standard Library',
        items: [
          { text: 'Overview', link: '/STDLIB' },
          { text: 'v1.0 Definitions', link: '/STDLIB_v1' },
          { text: 'Runtime Architecture', link: '/RUNTIME' },
          { text: 'Error Handling', link: '/ERROR_HANDLING' },
          { text: 'Concurrency', link: '/CONCURRENCY' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/RichardWilliyam/ritam' }
    ]
  }
})
