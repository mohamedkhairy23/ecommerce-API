const { validationResult } = require("express-validator");

/////////////// Code between for localizing express validator ///////////////////////////
// function handleLanguages(headers, errorsMapped) {
//   const language = headers["accept-language"].split(",")[0];
//   // eslint-disable-next-line no-restricted-syntax, guard-for-in
//   for (const errorKey in errorsMapped) {
//     errorsMapped[errorKey].msg = errorsMapped[errorKey].msg[language];
//   }

//   return errorsMapped;
// }

// // @desc  Finds the validation errors in this request and wraps them in an object with handy functions
// const validatorMiddleware = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const errorsInProperLanguage = handleLanguages(req.headers, errors.array());
//     return res.status(422).json({ errors: errorsInProperLanguage });
//     // return res.status(400).json({ errors: errors.array() });
//   }
//   next();
// };
/////////////// Code between for localizing express validator ///////////////////////////

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validatorMiddleware;
