const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
    entry: "./src/client/js/main.js",
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css",
    })],
    mode: 'development',
    output: {
        filename: "js/main.js",
        path: path.resolve(__dirname, "assets"),
},
module: {
    rules: [
        {
            test: /\.js$/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: [['@babel/preset-env', { targets: "defaults" }]],
                  },
            },
            
        },
        {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], //역순으로 입력 : webpack은 뒤에 부터 시작 
            // sass-loader -> scss파일을 css로 변환, style-loaer -> css code를 브라우저에 적용, MiniCssExtractPlugin -> css를 추출해서 별도의 파일로 만들어줌
        },
    ],
},
};