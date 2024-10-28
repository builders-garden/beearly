import * as fs from "node:fs/promises";
import * as path from "node:path";

// Fonts
export const interRegularFontData = await fs.readFile(
  path.join(path.resolve(process.cwd(), "public"), "Inter-Regular.ttf")
);

export const interBoldFontData = await fs.readFile(
  path.join(path.resolve(process.cwd(), "public"), "Inter-Bold.ttf")
);

export const firaScriptData = await fs.readFile(
  path.join(
    path.resolve(process.cwd(), "public"),
    "FiraCodeiScript-Regular.ttf"
  )
);
