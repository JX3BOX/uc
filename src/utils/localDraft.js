import IDB from '@jx3box/jx3box-common/js/idb';

class LocalDraft extends IDB {
    setDraft(key, value) {
        return new Promise((resolve, reject) => {
            this.db.ready().then(() => {
                this.db.setItem(key, value).then(() => {
                    resolve(true)
                }).catch(err => {
                    reject(err)
                })
            })
        })
    }

    getDraft(key) {
        return new Promise((resolve, reject) => {
            this.db.ready().then(() => {
                this.db.getItem(key).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        })
    }
}

export default LocalDraft
