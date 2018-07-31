方法介绍

此方法是用于图片压缩用的，详细用法请打开index.js查看

index.js 是放了ES6-7语法的主方法 可以复制放进自己项目的相关目录然后import直接使用

index.browser.js 放了由ES6-7语法解析后的ES5语法的主方法，可以直接用script标签引入，并在window下暴露compressImage方法提供使用，但需要配合polyfill支持包才能使用

index.html 直接使用的demo，打开控制台可以看到相关输出