import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginLess } from '@rsbuild/plugin-less';
// import postcssPluginPx2rem from "postcss-plugin-px2rem";

export default defineConfig({
  tools: {
    postcss: (opts, { addPlugins }) => {
      const viewportPlugin = require('postcss-plugin-px2rem')({
        rootValue: 16, //换算基数， 默认100 ,也就是1440px ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多少px了
        unitPrecision: 5, //允许REM单位增长到的十进制数字，其实就是精度控制
        mediaQuery: false, //（布尔值）允许在媒体查询中转换px
        minPixelValue: 0, //设置要替换的最小像素值(3px会被转rem)。 默认 0
      });
      addPlugins(viewportPlugin);
    },
  },
  plugins: [
    pluginReact(),
    pluginLess(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift([
          'babel-plugin-react-compiler',
          {
            target: '18',
          },
        ]);
      },
    }),
  ],
  resolve: {
    alias: {
      '@': './src',
    },
  },
});
