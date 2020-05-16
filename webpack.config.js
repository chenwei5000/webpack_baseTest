const path = require('path')
// 把生成出来的内嵌的css样式继承到一个css文件中，注意，规则里面就不要使用 style-loader 了
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const extPlugin = new MiniCssExtractPlugin({
  filename: '[name]-[contenthash].css',
  chunkFilename: '[name]-[contenthash].css',
})
// 引入生成在磁盘上的html生成插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 创建插件的实例，配置内存中的文件和在磁盘根目录生成的文件名称
const htmlPlugin = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
})

// 导入匹配vue文件的插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// 这里的模块化规范使用的是 Node 的 CommonJS
module.exports = {
  mode: 'development',
  entry: path.join(__dirname, './src/main.js'),
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
  },
  // 插件列表，修改后，需要重新 npm run dev
  plugins: [htmlPlugin, extPlugin, new VueLoaderPlugin()],
  // 所有第三方的模块配置规则
  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] },
      { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] },
      {
        test: /\'jpg|jpeg|png|gif|bmp|ttf|eot|svg|woff|woff2$/,
        loader: 'url-loader',
        options: {
          // 一般图片指定大小100kb所有  所以  10240
          // 小于 100kb 的图片就转换成内联的 base64 格式的图片，方便快速加载
          limit: 102400,
          name: 'images/[name]-[hash:8].[ext]',
        },
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        //exclude为排除项，意思是不要处理node_modules中的js文件
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
    ],
  },
}
