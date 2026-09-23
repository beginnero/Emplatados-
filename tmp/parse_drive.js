const https = require("https");
const fs = require("fs");

https.get("https://drive.google.com/drive/folders/1h-No8ULDfPBJdVOPGYOBqQvvRUfX-Em9", (res) => {
  let html = "";
  res.on("data", c => html += c);
  res.on("end", () => {
    fs.writeFileSync("/tmp/drive_folder.html", html);
    console.log("HTML length:", html.length);
    // Find all occurrences of image extensions
    const fileMatches = html.match(/[^"'\s\\]+\.(?:jpg|jpeg|png|webp|heic|JPG|JPEG|PNG|WEBP)/gi) || [];
    console.log("Images found in HTML:", [...new Set(fileMatches)]);
    
    // Look for patterns like ["<id>",["<filename>"
    const re = /\["([a-zA-Z0-9_-]{28,45})",\["([^"]+)"/g;
    let m;
    const items = [];
    while ((m = re.exec(html)) !== null) {
      items.push({ id: m[1], name: m[2] });
    }
    console.log("Matched items count:", items.length);
    items.forEach(i => console.log(i));
  });
});
