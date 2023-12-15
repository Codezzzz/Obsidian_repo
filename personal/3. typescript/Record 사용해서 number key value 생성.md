```ts

const item: SubjectType[] = ["한국사", "국어-비문학", "국어-문학", "영어"];

function itemRecord<T extends string>(item: T[]) {

	return item.reduce((acc, cur, idx) => {

		const _idx = idx as number;
		
		const _cur = cur as keyof typeof item;
		
		acc[_idx + 1] = _cur;
		
		return acc;
	
	}, {} as Record<number, keyof typeof item>) as Record<number, T>;

}

  

function itemInvertRecord<T extends string>(item: T[]) {
	
	return item.reduce((acc, cur, idx) => {
	
		const _idx = idx as number;
		
		const _cur = cur as keyof typeof item;
		
		acc[_cur] = _idx + 1;
		
		return acc;
	
	}, {} as Record<keyof typeof item, number>) as Record<T, number>;

}

```

## Use

```ts
const item: SubjectType[] = ["한국사", "국어-비문학", "국어-문학", "영어"];

const selectSubjectItem = itemRecord(item);

const selectSubjectItemInvert = itemInvertRecord(item);

//example
{
    "1": "한국사",
    "2": "국어-비문학",
    "3": "국어-문학",
    "4": "영어"
}

{
    "한국사": 1,
    "국어-비문학": 2,
    "국어-문학": 3,
    "영어": 4
}
```