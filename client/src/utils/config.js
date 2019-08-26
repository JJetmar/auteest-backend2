module.exports = {
  siteName: 'AutoTest',
  copyright: '© 2019 Josef Jetmar',
  logoPath: '/logo.svg',
  apiPrefix: '/api',
  fixedHeader: true, // sticky primary layout header

  /* Layout configuration, specify which layout to use for route. */
  layouts: [
    {
      name: 'primary',
      include: [/.*/]
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
      }/*,
      {
        key: 'cs',
        title: 'Čeština',
        flag: '/czech.svg',
      },*/
    ],
    defaultLanguage: 'en',
  },
}
