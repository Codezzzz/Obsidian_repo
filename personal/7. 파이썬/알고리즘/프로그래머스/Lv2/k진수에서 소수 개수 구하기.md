https://school.programmers.co.kr/learn/courses/30/lessons/92335

#10진수 #소수
```python
def solution(n, k):
    answer = rebase(n, k).split("0")
    result = 0
    for i in answer:
        if not i:
            continue  # 빈 문자열에 대한 예외처리
        if int(i) > 1 and prime_number(int(i)) == 1:
            result += 1
    return result


def rebase(n, q):
    rev_base = ""

    while n > 0:
        n, mod = divmod(n, q)
        rev_base += str(mod)

    return rev_base[::-1]


def prime_number(x):
    answer = 0
    for i in range(1, int(x**0.5) + 1):
        if x % i == 0:
            answer += 1
    return 1 if answer == 1 else 0
```