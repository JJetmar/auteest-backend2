module.exports = {
  siteName: 'Auteest',
  copyright: 'Ant Design Admin  © 2018 zuiidea',
  logoPath: '/logo.svg',
  apiPrefix: '/api',
  fixedHeader: true, // sticky primary layout header

  /* Layout configuration, specify which layout to use for route. */
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exclude: [/(\/(en|cs))*\/login/],
    },
  ],

  /* I18n configuration, `languages` and `defaultLanguage` are required currently. */
  i18n: {
    /* Countrys flags: https://www.flaticon.com/packs/countrys-flags */
    languages: [
      {
        key: 'en',
        title: 'English',
        flag: '/america.svg',
      },
      {
        key: 'cs',
        title: 'Čeština',
        flag: '/czech.svg',
      },
    ],
    defaultLanguage: 'cs',
  },
}
