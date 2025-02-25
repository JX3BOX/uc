import {
    __Root
} from '@jx3box/jx3box-common/data/jx3box.json'

function callback(product_name) {
    if (product_name.includes('https')) {
        return product_name
    } else {
        return __Root + 'vip/' + product_name + '?pay_success=1'
    }
}
export default callback