const { createWriteStream } = require("fs");

module.exports = async ({ stream, filename, mimetype }) => {
  // rename the file or you can let the current name
  const name = "chatty" + "_" + filename;
  // write path for the file
  const path = `media/images/${name}`;
  // (createWriteStream) writes our file to the images directory
  return new Promise(
    (resolve, reject) =>
      stream
        .pipe(createWriteStream(path))
        .on("finish", () => resolve({ path, name, mimetype }))
        .on("error", reject) // catch an error
  );
};
