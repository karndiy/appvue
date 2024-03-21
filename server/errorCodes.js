// errorCodes.js
const errorMessages = {
        ERRA000G: "Unknown error. Please check with administrator",
        ERRA001G: "Unauthorized",            
        ERRA002G:	"Invalid input",
        ERRA003G:	"Invalid brandcode",
        ERRA004G:	"Invalid domainname",
        ERRA005G:	"Invalid currency",
        ERRA006G:	"Brandcode and domainname not match",
        ERRA007G:	"System under maintenance",
        ERRA001M:	"Invalid credential",
        ERRA002M:	"Invalid user",
        ERRA003M:	"Member account is suspended",
        ERRA004M:	"Member token expired",
        ERRA005M:	"Referral code not exist",
        ERRA006M:	"Referral code currency not match",
        ERRA007M:	"This username has been taken. Please choose another username.",
        ERRA008M:	"Member account is locked",
        ERRA001P:	"Game provider under maintenance",
        ERRA002P:	"Game provider is offline",
        ERRA003P:	"Member currency is not supported by game provider",
        ERRA004P:	"Invalid game provider setting",
        ERRA005P:	"Launch game failed",
        ERRA006P:	"Game provider connction failed",
        ERRA007P:	"Invalid member token",
        ERRA008P:	"Game provider maintaining",
        ERRA001W:	"Withdraw failed. Member not yet reach turnover",
        ERRA002W:	"Withdraw failed. Insufficient wallet balance",
        ERRA003W:	"Member have pending withdrawal",
        ERRA001D:	"Member have pending deposit",
        ERRA002D:	"Deposit failed. Insufficient system balance",
    // Add the rest of your error messages here following the same pattern
  };

  module.exports = errorMessages;