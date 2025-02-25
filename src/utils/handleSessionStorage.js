function dispatchEventStorage(){
    const _setItem = sessionStorage.setItem;
    sessionStorage.setItem = function(key, value){
        let setEvent = new Event('setItemEvent')
        // key 为改变的 key， newVal 为改变的 value
        setEvent.key = key
        setEvent.newVal = value

        window.dispatchEvent(setEvent)

        _setItem.apply(this, arguments)
    }
}

export default dispatchEventStorage;
