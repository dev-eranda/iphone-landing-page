require('dotenv').config();

const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  console.log({ isProduction });

  return {
    entry: {
      index: './src/main.jsx', // Fixed path (removed leading slash)
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: isProduction ? '[name].[contenthash:8].js' : '[name].js', // Use contenthash only in production
      publicPath: '/',
      assetModuleFilename: 'assets/[hash][ext][query]', // Unified asset naming
    },
    resolve: {
      extensions: ['.js', '.jsx'], // Support for JS and JSX files
      alias: {
        '@': path.resolve(__dirname, 'src'), // Alias for easier imports
      },
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'), // Serve files from the dist folder
      },
      compress: true, // Enable gzip compression
      port: 8080, // Port for the development server
      hot: true, // Enable hot module replacement
      devMiddleware: {
        writeToDisk: true, // Write files to disk even in development
      },
    },
    mode: isProduction ? 'production' : 'development', // Dynamic mode based on env
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map', // Better source maps for dev
    optimization: {
      minimize: isProduction, // Minimize only in production
      minimizer: [
        new TerserPlugin({
          parallel: true, // Enable multi-threading for faster builds
          terserOptions: {
            compress: {
              drop_console: isProduction, // Remove console.log in production
            },
          },
        }),
        new CssMinimizerPlugin(), // Optimize CSS
      ],
      splitChunks: {
        chunks: 'all',
        minSize: 20000, // Minimum size for chunks
        maxSize: 244 * 1024, // 244 KiB
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/, // Split node_modules into a separate chunk
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
      runtimeChunk: 'single', // Extract runtime code into a separate chunk
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg|webp|ico)$/i, // Added webp support
          type: 'asset/resource',
          generator: {
            filename: isProduction ? 'assets/images/[name].[contenthash:8][ext]' : 'assets/images/[name].[ext]', // Use contenthash for caching
          },
          parser: {
            dataUrlCondition: {
              maxSize: 3 * 1024, // Inline images smaller than 3 KB
            },
          },
        },
        {
          test: /\.(mp4|webm|ogg|avi|mov)$/,
          type: 'asset/resource',
          generator: {
            filename: isProduction ? 'assets/videos/[name].[contenthash:8][ext]' : 'assets/videos/[name].[ext]', // Use contenthash for caching
          },
        },
        {
          test: /\.(glb|gltf)$/,
          type: 'asset/resource',
          generator: {
            filename: isProduction ? 'assets/models/[name].[contenthash:8][ext]' : 'assets/models/[name].[ext]', // Use contenthash for caching
          },
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader, // Extract CSS into separate files
            'css-loader', // Resolve CSS imports
            'postcss-loader', // PostCSS for autoprefixer and other plugins
          ],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // Cache Babel results for faster builds
            },
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(), // Clean the output directory before each build
      new HtmlWebpackPlugin({
        template: './index.html', // Use a template for HTML
        minify: isProduction
          ? {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
            }
          : false, // Minify HTML only in production
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash:8].css' : '[name].css', // Use contenthash only in production
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/assets/models/scene.glb'), // Use absolute path
            to: path.resolve(__dirname, 'dist/assets/models/scene[ext]'), // Use absolute path
          },
        ],
      }),
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/, // Compress specific file types
        threshold: 10240, // Only compress files larger than 10 KB
        minRatio: 0.8, // Only compress if the compression ratio is better than 0.8
        deleteOriginalAssets: false, // Keep original files
      }),
    ],
    performance: {
      hints: isProduction ? 'warning' : false, // Show performance hints in production
      maxAssetSize: 244 * 1024, // 244 KiB
      maxEntrypointSize: 244 * 1024, // 244 KiB
    },
  };
};
