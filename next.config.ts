import path from "path";
import webpack from "webpack";
// import HtmlWebpackPlugin from "html-webpack-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  webpack: (config, { isServer }) => {
    // --- Plugins ---
    config.plugins?.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
        process: "process/browser",
      }),
    );

    // --- Aliases ---
    config.resolve = config.resolve || {};
    config.resolve.symlinks = false;
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      fs: path.resolve(__dirname, "node_modules/pdfkit/js/virtual-fs.js"),
    };

    // --- Fallbacks ---
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      crypto: false,
      buffer: require.resolve("buffer/"),
      stream: require.resolve("readable-stream"),
      zlib: require.resolve("browserify-zlib"),
      util: require.resolve("util/"),
      assert: require.resolve("assert/"),
    };

    // --- Loaders ---
    config.module = config.module || {};
    config.module.rules = [
      ...(config.module.rules || []),
      {
        test: /\.afm$/,
        type: "asset/source",
      },
      {
        test: /src[/\\]static-assets/,
        type: "asset/inline",
        generator: {
          dataUrl: (content: Buffer) => {
            return content.toString("base64");
          },
        },
      },
      {
        test: /src[/\\]lazy-assets/,
        type: "asset/resource",
      },
    ];

    return config;
  },
};

export default nextConfig;
