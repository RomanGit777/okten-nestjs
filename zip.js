// zip.js
const fs = require("fs");
const archiver = require("archiver");
const output = fs.createWriteStream("deploy.zip");
const archive = archiver("zip", { zlib: { level: 9 } });
// Ensures forward slashes on Windows
archive.on("warning", err => console.warn(err));
archive.on("error", err => { throw err; });
archive.pipe(output);
// Add folders
archive.directory("backend/", "backend");
archive.directory("client/", "client");
archive.directory("mysql_db/", "mysql_db");
// Add files
archive.file(".env", { name: ".env" });
archive.file("docker-compose.yml", { name: "docker-compose.yml" });
archive.file("Dockerfile", { name: "Dockerfile" });
archive.file("nginx.conf", { name: "nginx.conf" });
// Exclude node_modules
archive.glob("backend/**", { ignore: ["backend/node_modules/**"] });
archive.finalize();
