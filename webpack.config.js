const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['es2015', 'react'] }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'UK CO2 Intensity',
            template: 'src/index.html'
        })
    ],
    resolve: {
        alias: {
            components: path.resolve(__dirname, 'src')
        },
        extensions: ['.js', '.jsx']
    }
} 