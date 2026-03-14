const { exec } = require("child_process");

exec("echo hello world", (error, stdout, stderr) => {
  if (error) {
    console.error("Command failed:", error);
    return;
  }
  console.log("Output:", stdout); // "hello world"
});
