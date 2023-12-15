
## Once
- Once 함수는 이미 호출된 함수가 다시 실행되지 않도록 하는 메서드 입니다
```js
function once(func) {
  let ran = false;
  let result;
  return function() {
    if (ran) return result;
    result = func.apply(this, arguments);
    ran = true;
    return result;
  };
}
```