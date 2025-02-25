export default function (url){
    if(process.env.NODE_ENV == 'production'){
        return '/dashboard/' + url
    }else{
        if(location.pathname.startsWith('/publish')){
            return '../' + url
        }else{
            return './' + url
        }
    }
}