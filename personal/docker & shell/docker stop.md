
```sh

docker stop $(docker ps -aq --filter ancestor={IMAGE_NAME})
docker rm -f $(docker ps -aq --filter ancestor={IMAGE_NAME})
docker rmi {IMAGE_NAME}
```


docker stop $(docker ps -a -q) 
docker rm $(docker ps -a -q)
docker rmi -f $(docker images -a -q)


{"severity":"INFO","level":30,"time":1724654406482,"pid":1120,"hostname":"hjchoi.local","message":"Server listening at http://0.0.0.0:18000"}
{"severity":"INFO","level":30,"time":1724654409914,"pid":1120,"hostname":"hjchoi.local","reqId":"opLUel4nRSG4sgGo4ig8RQ-0","req":{"method":"POST","url":"/v8/artifacts/events","hostname":"localhost:18000","remoteAddress":"127.0.0.1","remotePort":51967},"message":"incoming request"}
{"severity":"INFO","level":30,"time":1724654409917,"pid":1120,"hostname":"hjchoi.local","reqId":"opLUel4nRSG4sgGo4ig8RQ-0","res":{"statusCode":200},"responseTime":3.055999994277954,"message":"request completed"}



For help, see: https://nodejs.org/en/docs/inspector
{"severity":"INFO","level":30,"time":1724654406482,"pid":1120,"hostname":"hjchoi.local","message":"Server listening at http://0.0.0.0:18000"}
{"severity":"INFO","level":30,"time":1724654409914,"pid":1120,"hostname":"hjchoi.local","reqId":"opLUel4nRSG4sgGo4ig8RQ-0","req":{"method":"POST","url":"/v8/artifacts/events","hostname":"localhost:18000","remoteAddress":"127.0.0.1","remotePort":51967},"message":"incoming request"}
{"severity":"INFO","level":30,"time":1724654409917,"pid":1120,"hostname":"hjchoi.local","reqId":"opLUel4nRSG4sgGo4ig8RQ-0","res":{"statusCode":200},"responseTime":3.055999994277954,"message":"request completed"}
{"severity":"INFO","level":30,"time":1724654468345,"pid":1120,"hostname":"hjchoi.local","reqId":"opLUel4nRSG4sgGo4ig8RQ-1","req":{"method":"GET","url":"/v8/artifacts/a377c6d3dfb3d652","hostname":"localhost:18000","remoteAddress":"127.0.0.1","remotePort":52233},"message":"incoming request"}
{"severity":"WARNING","level":40,"time":1724654468346,"pid":1120,"hostname":"hjchoi.local","reqId":"opLUel4nRSG4sgGo4ig8RQ-1","data":null,"isBoom":true,"isServer":false,"output":{"statusCode":400,"payload":{"statusCode":400,"error":"Bad Request","message":"querystring should have required property 'team'"},"headers":{}},"stack":"Error: querystring should have required property 'team'\n    at Object.handler (file:///Users/develop/Documents/workspace/wisenut/turborepo-remote-cache/src/plugins/remote-cache/routes/get-artifact.ts:1:326)\n    at preHandlerCallback (/Users/develop/Documents/workspace/wisenut/turborepo-remote-cache/node_modules/.pnpm/fastify@4.12.0/node_modules/fastify/lib/handleRequest.js:128:37)\n    at preValidationCallback (/Users/develop/Documents/workspace/wisenut/turborepo-remote-cache/node_modules/.pnpm/fastify@4.12.0/node_modules/fastify/lib/handleRequest.js:112:5)\n    at handler (/Users/develop/Documents/workspace/wisenut/turborepo-remote-cache/node_modules/.pnpm/fastify@4.12.0/node_modules/fastify/lib/handleRequest.js:76:7)\n    at handleRequest (/Users/develop/Documents/workspace/wisenut/turborepo-remote-cache/node_modules/.pnpm/fastify@4.12.0/node_modules/fastify/lib/handleRequest.js:24:5)\n    at runPreParsing (/Users/develop/Documents/workspace/wisenut/turborepo-remote-cache/node_modules/.pnpm/fastify@4.12.0/node_modules/fastify/lib/route.js:530:5)\n    at next (/Users/develop/Documents/workspace/wisenut/turborepo-remote-cache/node_modules/.pnpm/fastify@4.12.0/node_modules/fastify/lib/hooks.js:168:7)\n    at handleResolve (/Users/develop/Documents/workspace/wisenut/turborepo-remote-cache/node_modules/.pnpm/fastify@4.12.0/node_modules/fastify/lib/hooks.js:185:5)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)","type":"Error","message":"querystring should have required property 'team'"}
{"severity":"INFO","level":30,"time":1724654468348,"pid":1120,"hostname":"hjchoi.local","reqId":"opLUel4nRSG4sgGo4ig8RQ-1","res":{"statusCode":400},"responseTime":2.0423330068588257,"message":"request completed"}
{"severity":"INFO","level":30,"time":1724654468550,"pid":1120,"hostname":"hjchoi.local","reqId":"opLUel4nRSG4sgGo4ig8RQ-2","req":{"method":"POST","url":"/v8/artifacts/events","hostname":"localhost:18000","remoteAddress":"127.0.0.1","remotePort":52233},"message":"incoming request"}
{"severity":"INFO","level":30,"time":1724654468551,"pid":1120,"hostname":"hjchoi.local","reqId":"opLUel4nRSG4sgGo4ig8RQ-2","res":{"statusCode":200},"responseTime":0.8806250095367432,"message":"request completed"}
