const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const apiPath = path.join(root, "src", "app", "api");
const tempPath = path.join(root, "src", "app_api_routes");

let moved = false;
if (fs.existsSync(apiPath)) {
  fs.renameSync(apiPath, tempPath);
  moved = true;
}

try {
  console.log("Building static export for Firebase Hosting...");
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, NEXT_EXPORT: "true" },
  });
  console.log("Static export successfully built into /out");
} finally {
  if (moved && fs.existsSync(tempPath)) {
    fs.renameSync(tempPath, apiPath);
  }
}
