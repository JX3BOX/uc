export default function(val){
    if(!val) return true
    if(Array.isArray(val) && !val.length) return true
    if(typeof val == 'object' && !Object.keys(val).length) return true
    return false
}