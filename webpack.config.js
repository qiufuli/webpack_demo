const path = require('path');
const webpack = require('webpack');
// 压缩代码用的插件 需要先引用  然后在plugin中配置
//const uglify = require('uglifyjs-webpack-plugin');
//html压缩插件
const htmlPlugin = require('html-webpack-plugin');
//css分离
const extractTextPlugin = require('extract-text-webpack-plugin');
// 
const glob = require('glob');
//消除多余的css
const PurifycssPlugin = require('purifycss-webpack');
//模块化
const entry = require('./webpack_config/entry_webpack.js');

console.log( encodeURIComponent(process.env.type) );
if(process.env.type=="build"){
	var website = {
	publicPath:'http://192.168.9.243:1717/'
	}
}else{
	var website = {
	publicPath:'http://cdn.jspang.com:1717/'
	}
}
module.exports = {
	//entry 入口
	entry:{
		entry:entry.path.entry,
	},
	//output 出口
	output:{
		//path.resolve(__dirname,'dist') node的语法 path必须需要引用
		path:path.resolve(__dirname,'dist'),
		filename:'[name].js',
		//设置公共路径
		publicPath:website.publicPath
	},
	//module 解读打包css 图片的转换压缩
	module:{
		//rules是规则 所有的文件转换都在这里
		rules:[
			{
				//test 用正则的方式来找到我们的扩展名
				test:/\.css$/,
				use:extractTextPlugin.extract({
					fallback:'style-loader',
					use:[
						{
							loader:'css-loader'
						},
						{
							loader:'postcss-loader'
						}
					]
				})
			},
			{
				test:/\.(png|jpg|gif)$/,
				use:[{
					loader:'url-loader',
					options:{
						limit:5000,
						//图片输出路径
						outputPath:'images/'
					}
				}]
			},
			{
				//处理html中img标签的打包
				test:/\.(htm|html)$/i,
				use:['html-withimg-loader']
			},
			{
				test:/\.less$/,
//				use:[
//					{ 
//						loader:'style-loader'
//					},{
//						loader:'css-loader'
//					},{
//						loader:'less-loader'
//					}
//				]
				use:extractTextPlugin.extract({
					use:[
						{
							loader:'css-loader'
						},{
							loader:'less-loader'
						}
					],
					fallback:'style-loader'
				})
			},
			{
				test:/\.(jsx|js)$/,
				use:{
					loader:'babel-loader'
					
				},
				exclude:/node_modules/
			}
		]
	},
	//plugins 用到的插件
	plugins:[ 
		//new uglify()
		new htmlPlugin({
			minify:{
				// removeAttributeQuotes 去“”引号
				removeAttributeQuotes:true,
			}, 
			hash:true,
			template:'./src/index.html'
		}),
		new extractTextPlugin("css/index.css"),
		// 去除没用到的css
		new PurifycssPlugin({
			paths:glob.sync(path.join(__dirname,'src/*.html'))
		}),
		//设置备注用的
		new webpack.BannerPlugin('邱福利 版权所有')
	],
	// devServer配置服务
	devServer:{
		//contentBase 是需要用到这个服务的地方是哪里 
		contentBase:path.resolve(__dirname,'dist'),
		//host 一个服务地址 这里用的本机ip
		host:'192.168.9.243',
		//compress 是否启用服务器压缩
		compress:true,
		//port 端口
		port:1717
		//这些配置好了后 需要安装下这个服务才能用
		//cnpm install webpack-dev-server --save-dev
	},
	watchOptions:{
		//监测修改时间 ms
		poll:1000,
		//重复按键的间隔时间
		aggregateTimeout:500,
		//忽略文件
		ignored:/node_modules/,
	}
}
