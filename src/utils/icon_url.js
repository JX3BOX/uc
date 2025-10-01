/**
 * IconID 转 URL
 *
 * @param {*} icon_id IconID
 */
const {__imgPath, __iconPath} = require("@/utils/config");

export default (icon_id) => {
    if (isNaN(parseInt(icon_id))) {
        return `${__imgPath}image/common/nullicon.png`;
    } else {
        return `${__iconPath}icon/${icon_id}.png`;
    }
};
