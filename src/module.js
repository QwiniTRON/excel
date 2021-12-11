console.log("Module.js");

(async () => {
  const result = await Promise.resolve(1);
  console.log(result);
})();
