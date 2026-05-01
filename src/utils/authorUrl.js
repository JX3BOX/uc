/**
 * 用户主页链接
 * @param {*} user_id 用户ID
 */

const {__Root} = require("@/utils/config");

export default (user_id) => {
  return user_id ? `${__Root}author/?uid=${user_id}` : null;
}
