const path = require('path');

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'F-StarWars',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  axios: {
    baseURL: 'http://127.0.0.1:8000', // URL del backend
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.forEach(route => {
        if (route.path === '/') {
          route.meta = { showContainer: false }; 
        } else {
          route.meta = { showContainer: true }; 
        }
      });
    }
  },


  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/css/style.css",
        'bootstrap/dist/css/bootstrap.min.css',
        'bootstrap-icons/font/bootstrap-icons.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, { isDev, isClient }) {
      
      config.module.rules.push({
        test: /\.(woff2?|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[Starjedi].[ttf]',
        },
        
      });
      config.module.rules.push({
        test: /\.(mp3|wav|ogg)$/, 
        loader: 'file-loader',
        options: {
          name: 'audio/[bsoSW].[mp3]', 
        },
      });
      config.resolve.alias['~'] = path.resolve(__dirname);
      config.resolve.alias['@'] = path.resolve(__dirname, 'assets');

    }
  }
}
