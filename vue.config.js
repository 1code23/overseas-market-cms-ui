module.exports = {
  publicPath: "./",
  devServer: {
    // host: "127.0.0.1",
    // hot: true,
    // open: true,
    port: 8080,
    proxy: {
      "/api": {
        target: "http://10.20.40.80:9123", //开发环境
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      // 别名
      alias: {
        assets: "@/assets",
        components: "@/components",
        utils: "@/common/utils",
      },
    },
  },
};
