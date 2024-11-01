```yaml
version: '3.8'
services:
    turborepo-remote-cache:
        image: ducktors/turborepo-remote-cache:latest
        environment:
            - PORT=18000
            - TURBO_TOKEN=wisenut-remote-cache
            - STORAGE_PROVIDER=local
            - STORAGE_PATH=/data/cache
            - LOG_LEVEL=info
            - ALLOW_LIST=http://localhost:3000
        volumes:
            - ./.turbo/cache:/data/cache
        ports:
            - '18000:18000'
        # healthcheck:
        #     test: ['CMD', 'wget', '--spider', 'http://localhost:3000/health']
        #     interval: 1s
        #     timeout: 3s
        #     retries: 30

volumes:
    turbo-cache-data:
        driver: local

```g