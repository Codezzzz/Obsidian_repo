https://school.programmers.co.kr/learn/courses/30/lessons/42748

```python
def solution(array, commands):
    return [sorted(array[x-1:y])[z-1] for x, y, z in commands]
```