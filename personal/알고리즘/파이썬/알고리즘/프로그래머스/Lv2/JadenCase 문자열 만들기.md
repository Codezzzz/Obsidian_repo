
https://school.programmers.co.kr/learn/courses/30/lessons/12951

#대소문자
```python
def solution(s):
    answer = []

    for word in s.split(" "):
        answer.append(word.capitalize())
    return " ".join(answer)
```