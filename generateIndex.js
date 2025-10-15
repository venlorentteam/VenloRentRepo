// generateIndex.js
const fs = require("fs");
const path = require("path");

const baseDirs = ["src/components", "src/pages"];
const outputFile = "src/exports.js";

let content = "// 🚀 Auto-generated exports.js file\n\n";

baseDirs.forEach((dir) => {
  const files = fs.readdirSync(dir);
  const category = dir.split("/").pop().toUpperCase();

  content += `// ==== ${category} ====\n`;
  files.forEach((file) => {
    // Handle only .js or .jsx files
    if (file.endsWith(".js") || file.endsWith(".jsx")) {
      const name = file.replace(".js", "").replace(".jsx", "");
      content += `export { default as ${name} } from "./${dir.replace(
        "src/",
        ""
      )}/${name}";\n`;
    }
  });
  content += "\n";
});

fs.writeFileSync(outputFile, content);
console.log("exports.js updated successfully!");
