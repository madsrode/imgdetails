import express, { json } from "express";
import fileUpload from "express-fileupload";
import { hash } from "imghash";
import imageSize from "image-size";

const app = express();
const port = 3000;

app.use(
  fileUpload({
    createParentPath: true,
  }),
  json()
);

app.post("/hash-file", async (req, res) => {
  console.log("Processing image from file " + req.headers["content-type"]);
  try {
    if (!req.files || !req.files.image) {
      console.log("No image file uploaded");
      return res.status(400).send("No image file uploaded");
    }

    let image = req.files.image;

    console.log("Fetching image", imageSize);

    const size = imageSize(image.data);

    let hashOut = await hash(image.data, 16);

    const result = { hash: { value: hashOut, type: "blockhash8" }, ...size };

    console.log("Sending result", result);

    res.send(result);
  } catch (err) {
    console.log("Error processing image", err);
    res.status(500).send({ error: err.message });
  }
});

app.post("/hash-url", async (req, res) => {
  try {
    const { url } = req.body;

    console.log("Processing image from URL:", url);

    const response = await fetch(url);
    if (response.status !== 200) {
      return res
        .status(500)
        .send("Failed to fetch image: ", response.statusText);
    }

    const bytes = await response.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const size = imageSize(buffer);

    let hashOut = await hash(buffer, 16);

    const result = { hash: { value: hashOut, type: "blockhash8" }, ...size };

    console.log("Sending result", result);

    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
