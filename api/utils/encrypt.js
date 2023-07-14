const { AES, enc } = require('crypto-js');
const key = process.env.SECRET_KEY;

function encryptObject(object) {
  const jsonString = JSON.stringify(object);
  const encrypted = AES.encrypt(jsonString, key).toString();
  return encrypted;
}

module.exports.encryptObject = encryptObject;

function decryptObject(encryptedData) {
  const decryptedHex = AES.decrypt(encryptedData, key).toString();
  const decrypted = enc.Hex.parse(decryptedHex).toString(enc.Utf8);

  try {
    const object = JSON.parse(decrypted);
    return object;
  } catch (error) {
    throw new Error(`Failed to parse decrypted data: ${error}`);
  }
}

module.exports.decryptObject = decryptObject;