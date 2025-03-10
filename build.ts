#!/usr/bin/env -S deno run -A --allow-scripts

import * as sass from "npm:sass";
import * as yaml from "npm:js-yaml";

interface Asset {
  name: string;
  css: string;
}

interface Theme {
  version: string;
  theme: string;
  description: string;
  assets: Asset[];
}

interface Gitea {
  gitea: Theme;
}

async function buildTheme(themePath: string) {
  try {
    const inputFile = "sass/theme-github.scss";
    const outputFile = "dist/theme-github.css";

    const result = await sass.compileAsync(inputFile, { sourceMap: false, style: "compressed" });
    await Deno.writeTextFile(outputFile, result.css);

    const fileContent = await Deno.readTextFile(themePath);
    const data: Gitea = yaml.load(fileContent);
    console.log(data.gitea.version);
  } catch (error) {
    let e = error;
    if (error instanceof Error) {
      e = error.message;
    }
    console.error("Build failed:", e);
    Deno.exit(1);
  }
}

buildTheme("theme.yml");
