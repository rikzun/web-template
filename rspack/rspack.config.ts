import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { HtmlRspackPlugin, SwcJsMinimizerRspackPlugin, LightningCssMinimizerRspackPlugin, CopyRspackPlugin, DefinePlugin } from "@rspack/core"
import { TsCheckerRspackPlugin } from "ts-checker-rspack-plugin"
import ReactRefreshRspackPlugin from "@rspack/plugin-react-refresh"
import type { Configuration, NormalModule } from "@rspack/core"
import type { Config as SwcConfig } from "@rspack/core/compiled/@swc/types"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const IS_DEVELOPMENT = process.env.NODE_ENV !== "production"
const IS_SERVE = process.env.WEBPACK_SERVE == "true"

const PATH_NODE_MODULES_FOLDER = path.join(__dirname, "node_modules")
const PATH_OUTPUT_FOLDER = path.join(__dirname, "build")
const PATH_PUBLIC_FOLDER = path.join(__dirname, "public")
const PATH_PUBLIC_ENTRY = path.join(PATH_PUBLIC_FOLDER, "index.html")
const PATH_SOURCE_FOLDER = path.join(__dirname, "src")
const PATH_SOURCE_ENTRY = path.join(PATH_SOURCE_FOLDER, "index.tsx")
const PATH_TS_CONFIG = path.join(__dirname, "tsconfig.json")

const ALIAS_ASSETS_FOLDER = path.join(PATH_SOURCE_FOLDER, "assets")
const ALIAS_ATOMS_FOLDER = path.join(PATH_SOURCE_FOLDER, "atoms")
const ALIAS_COMPONENTS_FOLDER = path.join(PATH_SOURCE_FOLDER, "components")
const ALIAS_UTILS_FOLDER = path.join(PATH_SOURCE_FOLDER, "utils")
const ALIAS_WORKERS_FOLDER = path.join(PATH_SOURCE_FOLDER, "workers")

const targets = ["last 2 versions", "> 0.2%", "not dead", "Firefox ESR"]

const config: Configuration = {
    mode: IS_DEVELOPMENT ? "development" : "production",
    devtool: IS_DEVELOPMENT ? "source-map" : false,
    entry: PATH_SOURCE_ENTRY,
    output: {
        path: PATH_OUTPUT_FOLDER,
        filename: IS_SERVE ? "[name].js" : "[name].[fullhash:8].js",
        chunkFilename: "[name].[chunkhash:8].js",
        publicPath: "auto",
        clean: true
    },
    cache: true,
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendor: {
                    name: "vendors",
                    chunks: "all",
                    test: (module) => (module as NormalModule).resource
                        ?.startsWith(PATH_NODE_MODULES_FOLDER) ?? false
                }
            }
        },
        minimizer: [
            new SwcJsMinimizerRspackPlugin(),
            new LightningCssMinimizerRspackPlugin({
                minimizerOptions: { targets }
            })
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".scss", ".sass"],
        fallback: { process: false },
        modules: [__dirname, PATH_SOURCE_FOLDER, PATH_NODE_MODULES_FOLDER],
        alias: {
            "@assets": ALIAS_ASSETS_FOLDER,
            "@atoms": ALIAS_ATOMS_FOLDER,
            "@components": ALIAS_COMPONENTS_FOLDER,
            "@utils": ALIAS_UTILS_FOLDER,
            "@workers": ALIAS_WORKERS_FOLDER
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
                    loader: "builtin:swc-loader",
                    options: {
                        jsc: {
                            parser: {
                                syntax: "typescript",
                                tsx: true
                            },
                            transform: {
                                react: {
                                    runtime: "automatic",
                                    development: IS_DEVELOPMENT,
                                    refresh: IS_DEVELOPMENT && IS_SERVE
                                }
                            }
                        },
                        env: { targets }
                    } as SwcConfig
                }
            },
            {
                test: /\.s?[ca]ss$/,
                use: {
                    loader: "sass-loader",
                    options: {
                        api: "modern-compiler",
                        implementation: "sass-embedded"
                    }
                },
                type: "css/auto"
            },
            {
                test: /\.svg$/,
                use: "@svgr/webpack"
            },
            {
                resourceQuery: /url/,
                type: "asset/resource"
            },
            {
                resourceQuery: /data/,
                type: "asset/inline"
            }
        ]
    },
    plugins: [
        new TsCheckerRspackPlugin(),
        new HtmlRspackPlugin({
            template: PATH_PUBLIC_ENTRY,
            filename: "index.html?[fullhash:8]"
        }),
        new CopyRspackPlugin({
            patterns: fs.readdirSync(PATH_PUBLIC_FOLDER, { withFileTypes: true }).map((file) => {
                const location = path.join(file.parentPath, file.name)
                
                return {
                    from: location,
                    to: file.name
                }
            }).filter((location) => location.from != PATH_PUBLIC_ENTRY)
        }),
        (IS_DEVELOPMENT && IS_SERVE) && new ReactRefreshRspackPlugin()
    ],
    experiments: {
        css: true,
        cache: {
            type: "persistent",
            buildDependencies: [__filename, PATH_TS_CONFIG]
        }
    }
}

export default config