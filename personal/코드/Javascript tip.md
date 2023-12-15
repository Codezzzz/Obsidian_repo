### Unique array 생성 
#unique_array 
```js
const arr = ["a", "b", "c", "d", "d", "c", "e"]
const uniqueArray = Array.from(new Set(arr));

console.log(uniqueArray); // ['a', 'b', 'c', 'd', 'e']
```


### 쿼리 스트링 문자열 생성
#create_query_string
```js
function createQueryString(object) {
  return Object.entries(object)
    .filter(([, value]) => value != null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((x) => [key, x])
      }
      return [[key, value]]
    })
    .flat()
}

function solution(input) {
  const object = JSON.parse(input)
  const answer = createQueryString(object)
  return answer
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0
}
```