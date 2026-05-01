import {
    __Root
} from '@/utils/config'

function callback(product_name) {
    if (product_name.includes('https')) {
        return product_name
    } else {
        return __Root + 'vip/' + product_name + '?pay_success=1'
    }
}
export default callback
