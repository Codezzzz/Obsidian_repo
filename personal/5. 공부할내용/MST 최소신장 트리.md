
https://velog.io/@fldfls/%EC%B5%9C%EC%86%8C-%EC%8B%A0%EC%9E%A5-%ED%8A%B8%EB%A6%AC-MST-%ED%81%AC%EB%A3%A8%EC%8A%A4%EC%B9%BC-%ED%94%84%EB%A6%BC-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98

#mst #크루스칼 
```python
def solution(n, costs):
    answer = 0
    parent = [0] * (n + 1)
    costs = sorted(costs, key=lambda x: (x[2]))

    for i in range(1, n + 1):
        parent[i] = i

    def find(a):
        if parent[a] == a:
            return a

        parent[a] = find(parent[a])
        return parent[a]

    def union(a, b):
        a = find(a)
        b = find(b)
        if a != b:
            parent[a] = b

    for a, b, cost in costs:
        if find(a) != find(b):
            union(a, b)
            answer += cost
    return answer
```

#mst #prim #우선순위 

```python
from heapq import heappush, heappop

def solution(n, costs):
    answer = 0
    visited = [False] * n

    costs_all = [[] for _ in range(n)]

    heep = []

    heappush(heep, (0, 0))
    for a, b, cost in costs:
        costs_all[a].append([cost, b])
        costs_all[b].append([cost, a])

    cnt = 0

    while cnt < n:
        cost, start = heappop(heep)

        if visited[start]:
            continue

        cnt += 1
        answer += cost
        visited[start] = True
        for c in costs_all[start]:
            heappush(heep, c)

    return answer
```