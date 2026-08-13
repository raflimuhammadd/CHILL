module.exports = {
    apps: [
        {
            name: 'chill-streams-api',
            script: './index.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production'
            },
            env_production: {
                NODE_ENV: 'production'
            },
            log_file: './logs/combined.log',
            out_file: './logs/out.log',
            error_file: './logs/error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true,
            max_memory_restart: '300M',
            restart_delay: 3000,
            max_restarts: 5,
            min_uptime: '10s',
            autorestart: true,
            watch: false
        }
    ]
};