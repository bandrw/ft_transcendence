import bcryptjs from "bcryptjs";

export default {
  comparePassword(userInput, serverResponse) {
    return bcryptjs.compareSync(userInput, serverResponse);
  },
  hash(password, rounds, callback) {
    return bcryptjs.hash(password, rounds, callback);
  },
};
