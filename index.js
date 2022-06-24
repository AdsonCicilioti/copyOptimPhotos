import { readFileSync, rename, renameSync } from "node:fs";
import path from "node:path";
import { execSync } from "child_process";
import "dotenv/config";

function getPhotosList(src) {
  const file = readFileSync(src, "utf-8");
  return JSON.parse(file);
}

function copyPhotos(srcDir, destDir, images) {
  if (!srcDir) {
    console.log("SOURCE DIR do not provided");
    return;
  }
  if (!destDir) {
    console.log("DEST DIR do not provided");
    return;
  }
  if (!images) {
    console.log("IMAGE LIST do not provided");
    return;
  }
  images.map((img) => {
    try {
      if (["jpg", "JPG", "jpeg", "JPEG"].includes(img.split(".")[1])) {
        execSync(
          `npx @squoosh/cli --resize '{"enabled":true,"width":500,"method":"lanczos3"}' --mozjpeg '{"quality":75,"baseline":false,"arithmetic":false,"progressive":true,"optimize_coding":true,"smoothing":0,"color_space":3,"quant_table":3,"auto_subsample":true,"chroma_subsample":2,"separate_chroma_quality":false,"chroma_quality":75}' --output-dir "${path.join(
            destDir,
            ""
          )}" "${path.join(srcDir, img)}"`
        );
        renameSync(
          path.join(destDir, `${img.split(".")[0]}.jpg`),
          path.join(destDir, img)
        );
      }
      if (["png", "PNG"].includes(img.split(".")[1])) {
        execSync(
          `npx @squoosh/cli --resize '{"enabled":true,"width":500,"method":"lanczos3"}' --oxipng '{"level":3,"interlace":false}' --output-dir "${path.join(
            destDir,
            ""
          )}" "${path.join(srcDir, img)}"`
        );

        renameSync(
          path.join(destDir, `${img.split(".")[0]}.png`),
          path.join(destDir, img)
        );
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      console.log("✅ Photos are optimized and copied!");
    }
  });
}

// usage
const { SRC_DIR, DEST_DIR } = process.env;
const photolist = getPhotosList("./photosList.json");

copyPhotos(SRC_DIR, DEST_DIR, photolist);
