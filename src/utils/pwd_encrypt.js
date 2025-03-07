import { JSEncrypt } from 'jsencrypt';
import { publicKey } from '@/assets/data/account/pwd_rsa';

const encryptor = new JSEncrypt();
encryptor.setPublicKey(publicKey);

export const encryptPassword = function(password) {
    return encryptor.encrypt(password);
}
