const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.ENCRYPTION_TOKEN);

const encryptOtp = (otp) => {
  var encrypted = cryptr.encrypt(otp);
  return encrypted;
};

const decryptOtp = (otp) => {
  const decrypted = cryptr.decrypt(otp);
  console.log(decrypted);
  return decrypted;
};

export { encryptOtp, decryptOtp };
