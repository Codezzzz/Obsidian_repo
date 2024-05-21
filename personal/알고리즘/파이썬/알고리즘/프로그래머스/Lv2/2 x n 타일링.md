
https://school.programmers.co.kr/learn/courses/30/lessons/12900

```python
def solution(n):
    answer = 0

    mod = 1000000007
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2

    for i in range(3, n + 1):
        dp[i] = (dp[i - 1] + dp[i - 2]) % mod

    return dp[n]
```