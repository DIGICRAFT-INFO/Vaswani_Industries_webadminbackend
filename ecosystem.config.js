module.exports = {
  apps: [{
    name: 'vaswani',
    script: '.next/standalone/server.js',
    // cwd must be the standalone folder so Next.js resolves its internal paths
    // correctly, but uploaded files should land in the project root's public/
    // directory which is accessible to the static file server.
    cwd: '/home/u374384555/domains/new.vaswaniindustries.com/.next/standalone',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0',
      // Point uploads to the standalone public/ folder so that both
      // the file writer (lib/upload.js) and the static file server
      // read/write the same directory.
      UPLOAD_DIR: '/home/u374384555/domains/new.vaswaniindustries.com/.next/standalone/public/uploads',
      // Leave BACKEND_URL empty — images are stored as relative paths
      BACKEND_URL: '',
      NEXT_PUBLIC_BACKEND_URL: '',
    },
  }],
};
