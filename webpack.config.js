const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        modules: [ 'node_modules', 'src' ],
        extensions: ['.js', '.jsx']
    }
} 