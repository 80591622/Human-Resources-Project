/**
 * 定义自定义指令
 */

// 获取焦点
/**
 * dom指令名:导出对象的名字
 * opt指令的逻辑:导出对象
 */
export const gfocus = {
  inserted (dom, opt) {
    // console.log(dom, opt)
    dom.focus()
  }
}

// 图片获取焦点失败显示默认图片
export const imagerror = {
  inserted (dom, opt) {
    // console.log(opt.value)
    // 图片异常触发异常事件显示默认图片
    dom.onerror = () => {
      dom.src = opt.value
    }
  }
}
