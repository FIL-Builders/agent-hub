import path from 'path';

export default function () {
  return {
    name: 'custom-webpack-yaml-loader',
    configureWebpack() {
      return {
        module: {
          rules: [
            {
              test: /\.ya?ml$/,
              include: [
                path.resolve(__dirname, '../../agents'),
              ],
              //use: 'yaml-loader', // ✅ THIS is the correct way
              use: 'raw-loader', // ✅ instead of 'asset/source'

            },
          ],
        },
        resolve: {
          extensions: ['.js', '.json', '.yaml', '.yml'],
        },
      };
    },
  };
}


