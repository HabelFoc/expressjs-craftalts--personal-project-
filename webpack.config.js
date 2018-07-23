const path = require('path');

module.exports = {
	entry: {
		main: './public/js/main.js',
		about: './public/js/about.js',
		generate: './public/js/generate.js',
		login: './public/js/login.js',
		register: './public/js/register.js',
		upload: './public/js/upload.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	},
	output: {
		path: path.join(__dirname, 'public/js/dist'),
		filename: '[name].bundle.js'
	}
}