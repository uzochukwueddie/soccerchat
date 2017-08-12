var isRealString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

var validate = (req, res, next) => {
   req.checkBody('username', 'Username Must Not Be Empty').notEmpty();
   req.check('username', 'Username Must Not Contain Any Space').noSpace();
   req.checkBody('email', 'Email is Required').notEmpty();
   req.checkBody('email', 'Email is Invalid').isEmail();
   req.checkBody('password', 'Password is Required').notEmpty();
   req.checkBody('password', 'Password Must Not Be Less Than 5').isLength({min:5});

    
    req.getValidationResult()
        .then((result) => {
            const errors = result.array();
            const messages = [];
            errors.forEach((error) => {
                messages.push(error.msg);
            });

            req.flash('error', messages);
            res.redirect('/signup');
        })
        .catch((err) => {
            return next();
        })
}

module.exports = {isRealString, validate};
