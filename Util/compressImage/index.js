
//压缩图片
/**
 * 通过input(file)标签将选择到的图片转成canvas再进行压缩，最后再输出图片的方式对图片进行压缩
 * 这里使用了es6-7的语法，故需配合babel和polyfill支持库进行解析
 * ！！！这是一个Promise异步方法，推荐在async方法内使用await关键字配合使用此方法，使之以同步代码形式呈现
 * 
 * @param {* Input(files)标签里 onchange时给的e参数  obj  必传  } file 
 * @param {* 压缩率参数（非直接压缩比率，而是canvas内部的一个压缩比率）  0.1~1 非必传 } asPercent 
 * @param {* 压缩完成的回调方法，接受一个压缩后的base64字符串参数   function 非必传 } callBack 
 * 
 * @return {* 返回一个base64格式类型的图片,可直接放进img标签的src属性进行预览图片}
 */


const compressImage =  (file, asPercent, callBack) => {
  return new Promise(async (rl, rj) => {
    try {
      let reader = new FileReader()
      reader.readAsDataURL(file.target.files[0])
      let result = null
      await new Promise((rl, rj) => {
          reader.onload = (a, b, c) => {
              result = a.currentTarget.result
              rl()
          }
      })

      let img = new Image()
      img.src = result 

      await new Promise((rl, rj) => {
          img.onload = (a, b, c) => {
              rl()
          }
      })

      let initSize = img.src.length
      let width = img.width
      let height = img.height

      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
          ratio = Math.sqrt(ratio)
          width /= ratio
          height /= ratio
      } else {
          ratio = 1
      }
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let tCanvas = document.createElement('canvas')
      let tctx = tCanvas.getContext('2d')

      canvas.width = width
      canvas.height = height

      //铺底色
      ctx.fillStyle = "#fff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = width * height / 1000000) > 1) {
          count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片

          //计算每块瓦片的宽和高
          let nw = ~~(width / count)
          let nh = ~~(height / count)

          tCanvas.width = nw
          tCanvas.height = nh

          for (let i = 0; i < count; i++) {   //逐个瓦片绘画进canvas
              for (let j = 0; j < count; j++) {
                  tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
                  ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
              }
          }
      } else {
          ctx.drawImage(img, 0, 0, width, height)
      }

      //进行最小压缩
      const ndata = canvas.toDataURL('image/jpeg', asPercent || null)

      console.log('压缩前：' + initSize)
      console.log('压缩后：' + ndata.length)
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%")

      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0

      // const iim = document.createElement("img")
      // iim.src = ndata
      // document.body.appendChild(iim)
      callBack && callBack(ndata)
      rl(ndata)
      
    } catch (error) {
      console.log(error)
      rj(error)
    }
  })
    

}

export default compressImage