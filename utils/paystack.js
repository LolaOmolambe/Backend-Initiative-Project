const paystack = (request) => {
  const initializePayment = (form, callback) => {
    const options = {
      url: "https://api.paystack.co/transaction/initialize",
      headers: {
        authorization: process.env.PAYSTACK_SECRET_KEY,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
      form,
    };
    const callbackFun = (error, response, body) => {
      return callback(error, body);
    };
    request.post(options, callbackFun);
  };
  const verifyPayment = (ref, callback) => {
    const options = {
      url:
        "https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref),
      headers: {
        authorization: process.env.PAYSTACK_SECRET_KEY,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    };
    const callbackFunc = (error, response, body) => {
      return callback(error, body);
    };
    request(options, callbackFunc);
  };

  return { initializePayment, verifyPayment };
};

module.exports = paystack;
