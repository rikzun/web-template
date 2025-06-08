const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'
const IS_SERVE = process.env.WEBPACK_SERVE == 'true'

const PATH_NODE_MODULES_FOLDER = path.join(__dirname, 'node_modules')
const PATH_OUTPUT_FOLDER = path.join(__dirname, 'build')
const PATH_PUBLIC_FOLDER = path.join(__dirname, 'public')
const PATH_PUBLIC_ENTRY = path.join(PATH_PUBLIC_FOLDER, 'index.html')
const PATH_SOURCE_FOLDER = path.join(__dirname, 'src')
const PATH_SOURCE_ENTRY = path.join(PATH_SOURCE_FOLDER, 'index.tsx')

const ALIAS_ASSETS_FOLDER = path.join(PATH_SOURCE_FOLDER, 'assets')
const ALIAS_COMPONENTS_FOLDER = path.join(PATH_SOURCE_FOLDER, 'components')

module.exports = () => {
    const config = {
        mode: IS_DEVELOPMENT ? 'development' : 'production',
        devtool: IS_DEVELOPMENT ? 'source-map' : false,
        entry: PATH_SOURCE_ENTRY,
        output: {
            path: PATH_OUTPUT_FOLDER,
            filename: '[name].[fullhash:8].js',
            chunkFilename: '[name].[chunkhash:8].js',
            publicPath: 'auto'
        },
        cache: {
            type: 'filesystem',
            buildDependencies: {
                config: [__filename]
            }
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        name: 'vendors',
                        chunks: 'all',
                        test: (module) => {
                            return module?.resource?.startsWith(PATH_NODE_MODULES_FOLDER)
                        }
                    }
                }
            },
            runtimeChunk: 'single'
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.sass'],
            fallback: { process: false },
            modules: [__dirname, PATH_SOURCE_FOLDER, 'node_modules'],
            alias: {
                '@assets': ALIAS_ASSETS_FOLDER,
                '@components': ALIAS_COMPONENTS_FOLDER
            }
        },
        devServer: {
            hot: true,
            open: true,
            compress: true,
            port: 3000,
            historyApiFallback: true
        },
        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/,
                    exclude: PATH_NODE_MODULES_FOLDER,
                    use: {
                        loader: 'swc-loader',
                        options: {
                            jsc: {
                                parser: {
                                    syntax: 'typescript',
                                    tsx: true
                                },
                                transform: {
                                    react: {
                                        runtime: 'automatic',
                                        refresh: IS_DEVELOPMENT && IS_SERVE
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    test: /\.s?[ca]ss$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                },
                {
                    test: /\.(png|jpe?g|gif|webp|ico|woff2?|eot|ttf|otf)$/i,
                    type: 'asset/resource'
                },
                {
                    test: /\.svg$/i,
                    issuer: /\.[jt]sx?$/,
                    use: ['@svgr/webpack']
                }
            ]
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: PATH_PUBLIC_ENTRY,
                filename: 'index.html?[fullhash:8]'
            }),
            new MiniCssExtractPlugin({
                filename: IS_DEVELOPMENT ? '[name].css' : '[name].[contenthash:8].css',
                chunkFilename: IS_DEVELOPMENT ? '[id].css' : '[id].[contenthash:8].css',
            }),
            new CopyWebpackPlugin({
                patterns: [{
                    from: PATH_PUBLIC_FOLDER,
                    filter: (filepath) => {
                        switch (path.normalize(filepath).substring(PATH_PUBLIC_FOLDER.length + 1)) {
                            case 'index.html': return false
                            default: return true
                        }
                    }
                }]
            })
        ]
    }

    if (IS_DEVELOPMENT && IS_SERVE) {
        config.plugins.push(new ReactRefreshWebpackPlugin())
    }

    return config
}
