import path from 'path'
import { fileURLToPath } from 'url'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'
const IS_SERVE = process.env.WEBPACK_SERVE == 'true'

const PATH_NODE_MODULES_FOLDER = path.join(__dirname, 'node_modules')
const PATH_OUTPUT_FOLDER = path.join(__dirname, 'build')
const PATH_PUBLIC_FOLDER = path.join(__dirname, 'public')
const PATH_PUBLIC_ENTRY = path.join(PATH_PUBLIC_FOLDER, 'index.html')
const PATH_SOURCE_FOLDER = path.join(__dirname, 'src')
const PATH_SOURCE_ENTRY = path.join(PATH_SOURCE_FOLDER, 'index.tsx')
const PATH_TS_CONFIG = path.join(__dirname, 'tsconfig.json')

const ALIAS_ASSETS_FOLDER = path.join(PATH_SOURCE_FOLDER, 'assets')
const ALIAS_COMPONENTS_FOLDER = path.join(PATH_SOURCE_FOLDER, 'components')
const ALIAS_UTILS_FOLDER = path.join(PATH_SOURCE_FOLDER, 'utils')

const vendorTest = new RegExp('^' + PATH_NODE_MODULES_FOLDER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

/** @type {import('webpack').Configuration | import('webpack-dev-server').Configuration} */
const config = {
    mode: IS_DEVELOPMENT ? 'development' : 'production',
    devtool: IS_DEVELOPMENT ? 'source-map' : false,
    entry: PATH_SOURCE_ENTRY,
    output: {
        path: PATH_OUTPUT_FOLDER,
        filename: '[name].[fullhash:8].js',
        chunkFilename: '[name].[chunkhash:8].js',
        publicPath: 'auto',
        clean: true
    },
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename, PATH_TS_CONFIG]
        }
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    chunks: 'all',
                    test: vendorTest
                }
            }
        }        
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss', '.sass'],
        fallback: { process: false },
        modules: [__dirname, PATH_SOURCE_FOLDER, 'node_modules'],
        alias: {
            '@assets': ALIAS_ASSETS_FOLDER,
            '@components': ALIAS_COMPONENTS_FOLDER,
            '@utils': ALIAS_UTILS_FOLDER
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
                test: /\.[jt]sx?$/i,
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
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/i,
                use: '@svgr/webpack'
            },
            {
                test: /\.(png|jpe?g|gif|webp|ico|woff2?|eot|ttf|otf)$/i,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
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
        }),
        (IS_DEVELOPMENT && IS_SERVE)
            ? new ReactRefreshWebpackPlugin()
            : null
    ]
}

export default config