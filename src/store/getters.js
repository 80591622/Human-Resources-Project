const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // 用户名称
  name: state => state.user.userInfo.username,
  // 用户头像
  avatar: state => state.user.userInfo.staffPhoto,
  // 手机号
  mobile: state => state.user.userInfo.mobile,
  // 登陆用户名
  userName: state => state.user.userInfo.username,
  // 工号
  workNumber: state => state.user.userInfo.workNumber

}
export default getters
