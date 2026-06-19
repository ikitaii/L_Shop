import fs from "fs";
import path from "path";
import os from "os";
import { RECOMMENDATIONS_PATH, REVIEWS_PATH } from "../../constants/paths";

const SERVER_DATA_DIR = path.join(__dirname, "../../data");

const copyFile = (src: string, dest: string) => {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
};

export const createDataSandbox = () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "lshop-server-test-"));
  const dataDir = path.join(tempDir, "data");
  fs.mkdirSync(dataDir, { recursive: true });

  const files = ["users.json", "products.json", "cart.json", "reviews.json", "recommendations.json"];
  files.forEach((fileName) => {
    copyFile(path.join(SERVER_DATA_DIR, fileName), path.join(dataDir, fileName));
  });

  process.env.DATA_DIR = dataDir;
  return {
    cleanup: () => {
      delete process.env.DATA_DIR;
      fs.rmSync(tempDir, { recursive: true, force: true });
    },
  };
};

export const resetOptionalData = () => {
  fs.writeFileSync(REVIEWS_PATH, "[]");
  fs.writeFileSync(RECOMMENDATIONS_PATH, "[]");
};
