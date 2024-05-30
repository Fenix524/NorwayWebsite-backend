import { asyncWrapper } from "../utils/asyncWrapper.js";

export const uploadFile = asyncWrapper(async (req, res, next) => {
  console.log(req.file);
  //   const { description } = req.body;
  //   const { path: temporaryName, originalname } = req.file;
  //   const fileName = path.join(storeImage, originalname);
  //   try {
  //     await fs.rename(temporaryName, fileName);
  //   } catch (err) {
  //     await fs.unlink(temporaryName);
  //     return next(err);
  //   }
  //   res.json({ description, message: "Файл успішно завантажено" });
});
