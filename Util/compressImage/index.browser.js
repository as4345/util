'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//压缩图片
/**
 * 通过input(file)标签将选择到的图片转成canvas再进行压缩，最后再输出图片的方式对图片进行压缩
 * 这里使用了es6-7的语法，故需配合babel进行解析
 * ！！！这是一个Promise异步方法，推荐使用await关键字配合使用此方法，使之以同步代码形式呈现
 * 
 * @param {* Input(files)标签里 onchange时给的e参数  obj  必传  } file 
 * @param {* 压缩率参数（非直接压缩比率，而是canvas内部的一个压缩比率）  0.1~1 非必传 } asPercent 
 * @param {* 压缩完成的回调方法，接受一个压缩后的base64字符串参数   function 非必传 } callBack 
 * 
 * @return {* 返回一个base64格式类型的图片,可直接放进img标签的src属性进行预览图片}
 */

var compressImage = function compressImage(file, asPercent, callBack) {
    return new Promise(function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(rl, rj) {
            var reader, result, img, initSize, width, height, ratio, canvas, ctx, tCanvas, tctx, count, nw, nh, i, j, ndata;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            reader = new FileReader();

                            reader.readAsDataURL(file.target.files[0]);
                            result = null;
                            _context.next = 6;
                            return new Promise(function (rl, rj) {
                                reader.onload = function (a, b, c) {
                                    result = a.currentTarget.result;
                                    rl();
                                };
                            });

                        case 6:
                            img = new Image();

                            img.src = result;

                            _context.next = 10;
                            return new Promise(function (rl, rj) {
                                img.onload = function (a, b, c) {
                                    rl();
                                };
                            });

                        case 10:
                            initSize = img.src.length;
                            width = img.width;
                            height = img.height;

                            //如果图片大于四百万像素，计算压缩比并将大小压至400万以下

                            ratio = void 0;

                            if ((ratio = width * height / 4000000) > 1) {
                                ratio = Math.sqrt(ratio);
                                width /= ratio;
                                height /= ratio;
                            } else {
                                ratio = 1;
                            }
                            canvas = document.createElement('canvas');
                            ctx = canvas.getContext('2d');
                            tCanvas = document.createElement('canvas');
                            tctx = tCanvas.getContext('2d');


                            canvas.width = width;
                            canvas.height = height;

                            //铺底色
                            ctx.fillStyle = "#fff";
                            ctx.fillRect(0, 0, canvas.width, canvas.height);

                            //如果图片像素大于100万则使用瓦片绘制
                            count = void 0;

                            if ((count = width * height / 1000000) > 1) {
                                count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片

                                //计算每块瓦片的宽和高
                                nw = ~~(width / count);
                                nh = ~~(height / count);


                                tCanvas.width = nw;
                                tCanvas.height = nh;

                                for (i = 0; i < count; i++) {
                                    //逐个瓦片绘画进canvas
                                    for (j = 0; j < count; j++) {
                                        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                                        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                                    }
                                }
                            } else {
                                ctx.drawImage(img, 0, 0, width, height);
                            }

                            //进行最小压缩
                            ndata = canvas.toDataURL('image/jpeg', asPercent || null);


                            console.log('压缩前：' + initSize);
                            console.log('压缩后：' + ndata.length);
                            console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");

                            tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

                            // const iim = document.createElement("img")
                            // iim.src = ndata
                            // document.body.appendChild(iim)
                            callBack && callBack(ndata);
                            rl(ndata);

                            _context.next = 38;
                            break;

                        case 34:
                            _context.prev = 34;
                            _context.t0 = _context['catch'](0);

                            console.log(_context.t0);
                            rj(_context.t0);

                        case 38:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[0, 34]]);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());
};