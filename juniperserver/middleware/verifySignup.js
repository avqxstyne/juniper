import {userModel} from '../DocumentSchema.js'

function checkDuplicateUsernameOrEmail(req, res, next) {
    // find the paramter username 
    userModel.findOne({
      username: req.body.username
    }).exec((err, user) => {
        // check for error
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      // Check is username exists
      if (user) {
        res.status(400).send({ message: "Operation unsuccessful: Username is already taken!" });
        return;
      }
  
      // Find the email
      userModel.findOne({
        email: req.body.email
      }).exec((err, user) => {
        // Check for error
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
  
        // Check is email exists
        if (user) {
          res.status(400).send({ message: "Operation unsuccessful: Username is already in use!" });
          return;
        }
  
        next();
      });
    });
};

  
  
// const verifySignUp = {
//     checkDuplicateUsernameOrEmail,
// };
  
// module.exports = verifySignUp;

export default checkDuplicateUsernameOrEmail