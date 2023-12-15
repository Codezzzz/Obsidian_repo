
```jsx
export const getStaticProps: GetStaticProps = async ctx => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [""],
    async () => {
      const response = await getApi;

      return response.data;
    },

  );

  return {

    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };

};
```