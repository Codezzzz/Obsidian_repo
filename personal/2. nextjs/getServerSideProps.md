```jsx
export const getServerSideProps: GetServerSideProps = async () => {

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(["projects"], async () => {

	const response = await getProjectLists();

	return response.data;
	});

  return {
	  props: {
		  dehydratedState: dehydrate(queryClient),
	},

  };

};
```