
```python
from collections import defaultdict
from sys import setrecursionlimit
from heapq import heappush, heappop, heapify

setrecursionlimit(10**9)
INF = 100000000000


def solution(N, src, dst, k, edges):
    graph = defaultdict(list)

    for a, b, c in edges:
        graph[a].append([b, c])

    print(graph)

    def dijkstra(start):
        q = [(0, start, k)]  # cost, 정점, 경유

        while q:
            cost, node, route = heappop(q)

            if node == dst:
                return cost
            if route >= 0:
                for a, b in graph[node]:
                    alt = cost + b
                    heappush(q, [alt, a, route - 1])
        return -1

    return dijkstra(src)


print(solution(3, 0, 2, 0, [[0, 1, 100], [1, 2, 100], [0, 2, 500]]))
```