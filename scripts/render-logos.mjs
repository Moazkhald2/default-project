#!/usr/bin/env node
import sharp from "sharp";
import { join } from "node:path";
const root = join(import.meta.dirname, "..", "assets");
const outWeb = join(import.meta.dirname, "..", "apps", "web", "public");
const jobs = [
  ["logo-main.svg", "logo-main.png", 840, 168],
  ["logo-symbol.svg", "logo-symbol.png", 512, 512],
  ["logo-white.svg", "logo-white.png", 840, 168],
  ["logo-main.svg", "logo.png", 840, 168],
  ["logo-symbol.svg", "symbol.png", 512, 512],
];
for (const [src, dst, w, h] of jobs) {
  const svg = join(root, src);
  const png = join(root, dst);
  await sharp(svg, { density: 300 }).resize(w, h, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(png);
  console.log(`✓ ${src} → ${dst} ${w}x${h}`);
  // also copy to web public
  const webPng = join(outWeb, dst);
  await sharp(svg, { density: 300 }).resize(w, h, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(webPng);
}
console.log("✅ PNG logos done");
