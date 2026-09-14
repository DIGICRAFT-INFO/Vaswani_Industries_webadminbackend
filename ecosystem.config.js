module.exports = {
  apps: [{
    name: 'vaswani',
    script: '.next/standalone/server.js',
    // cwd is the PROJECT ROOT — this is where Next.js standalone server
    // looks for public/ when serving static files, and where lib/upload.js
    // writes uploaded files to public/uploads/.
    cwd: '/home/u374384555/domains/new.vaswaniindustries.com',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0',
      // UPLOAD_DIR not set — lib/upload.js will use process.cwd()/public/uploads
      // which resolves to the project root public/uploads/ — correct location.
      BACKEND_URL: '',
      NEXT_PUBLIC_BACKEND_URL: '',
    },
  }],
};
