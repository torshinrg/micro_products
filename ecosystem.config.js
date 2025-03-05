module.exports = {
  apps: [
    {
      name: "simple apps",
      script: "npx",
      args: "serve@latest out -l 4000",
      env: {
        PORT: 4000,
      },
    },
  ],
};
