import otpGenerator from 'otp-generator';

export const newPassword=()=>{
    const otp = otpGenerator.generate(8, {
    upperCaseAlphabets: true,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true});

    return otp;
}