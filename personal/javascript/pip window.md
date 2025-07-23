
```js
const popup = window.open('https://example.com', 'popup', 'width=400,height=300');
// 종종 브라우저에 의해 차단됩니다.

//
const pipWindow = await documentPictureInPicture.requestWindow({
 width: 400,
 height: 300
});
// 항상 작동, 항상 상단에 있음
```