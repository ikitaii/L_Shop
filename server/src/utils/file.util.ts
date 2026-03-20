import fs from "fs";

export const readJSON = (path: string) => {
  const data = fs.readFileSync(path, "utf-8");
  return JSON.parse(data);
};

export const writeJSON = (path: string, data: unknown) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};
