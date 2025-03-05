module.exports = {
  apps: [
    {
      name: "simple apps",
      script: "npm",
      args: "run serve",
      env: {
        PORT: 4000,
      },
    },
  ],
};
