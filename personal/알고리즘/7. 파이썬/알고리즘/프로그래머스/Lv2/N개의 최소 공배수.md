https://school.programmers.co.kr/learn/courses/30/lessons/12953?language=python3

#최소공배수

```python
from math import gcd

from functools import reduce

def solution(arr):
    return lcm(arr)


def lcm(denominators):
    return reduce(lambda a, b: a * b // gcd(a, b), denominators)

```