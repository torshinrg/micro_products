module.exports = {
  apps: [
    {
      name: "simple apps",
      script: "npx",
      args: "serve out -l 4000",
      env: {
        PORT: 4000,
      },
    },
  ],
};
