const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: 'http://localhost:8080',
    //disableHostCheck: true,
    allowedHosts: ['https://puma-genuine-distinctly.ngrok-free.app'],
   
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
