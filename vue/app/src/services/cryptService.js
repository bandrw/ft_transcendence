import bcryptjs from "bcryptjs";

export default {
  comparePassword(userInput, serverResponse) {
    return bcryptjs.compareSync(userInput, serverResponse);
  },
};
