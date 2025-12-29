module.exports = {
  apps: [
    {
      name: 'redcrow-next',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000, // Optional: specify port
      },
      instances: '1', // Use maximum CPU cores for cluster mode
      exec_mode: 'fork', // Enables built-in cluster mode
      autorestart: true,
      watch: false, // Turn off watch in production
      max_memory_restart: '1G',
    },
  ],pm
};