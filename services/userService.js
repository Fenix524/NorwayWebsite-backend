import { updateModel } from "./DBOperations.js";

export const updateMeService = async (userData, user, file) => {
  if (file) {
    user.avatarURL = file.path.replace("public", "");
  }
  updateModel(userData, user);
  return user.save();
};
