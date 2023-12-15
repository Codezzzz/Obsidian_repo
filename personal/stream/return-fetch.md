```ts
import { authRequestRefreshToken } from "@features/auth/apis/auth";

import useUiStore from "@stores/ui";

import { refreshTokenService, tokenService } from "@utils/tokenService";

import returnFetch from "return-fetch";

  

const { VITE_APP_SERVER_URL } = import.meta.env;

  
let isTokenRefreshing = false;

let refreshSubscribers: any[] = [];

const onTokenRefreshed = (accessToken: string) => {
  refreshSubscribers.map((callback) => callback(accessToken));
  refreshSubscribers = [];
};

  

const addRefreshSubscriber = (callback: (accessToken: string) => void) => {
  refreshSubscribers.push(callback);
};

const setIsLogin = useUiStore.getState().setIsLogin;

const fetchExtended = returnFetch({
  baseUrl: VITE_APP_SERVER_URL,
  interceptors: {
    request: async (args, fetch) => {
      const accessToken = tokenService.getAccessToken();

      if (!accessToken) {
        throw { response: { status: 401 }, args };
      }

      if (accessToken) {
        const [url, init] = args;
        if (init && init.headers) {

          init.headers = {
            ...init.headers,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          };
        }
      }
      return args;
    },
    response: async (response, args, fetch) => {

      try {

        const { status } = response;
        let accessToken = tokenService.getAccessToken();
        if (status === 401) {
          if (!isTokenRefreshing) {
            isTokenRefreshing = true;

            const refreshToken = refreshTokenService.getRefreshToken();
            const decodeToken = refreshTokenService.decodeRefreshToken();

            if (!refreshToken || !decodeToken)
              throw new Error("Invalid refresh token");
              
            const { data } = await authRequestRefreshToken({
              refresh_token: refreshToken,
              user_id: decodeToken.userId,
              role: decodeToken.role,
            });

            if (!data) throw new Error("Invalid refresh token");

            accessToken = data.content.accessToken;
            tokenService.setAccessToken(accessToken);
            isTokenRefreshing = false;

            const [url, init] = args;

            if (init && init.headers) {
              console.log(init.headers);
              init.headers = {
                ...init.headers,
                Authorization: `Bearer ${accessToken}`,
              };

              args = [url, init];

            }
            setIsLogin(true);
          }

  
          const retryOriginalRequest = new Promise((resolve) => {
            addRefreshSubscriber((accessToken) => {
              resolve(fetchExtended(...args));
            });
          });

          // 새로운 토큰으로 지연되었던 요청 진행
          if (!isTokenRefreshing && accessToken) {
            onTokenRefreshed(accessToken);
          }

          return retryOriginalRequest as Promise<Response>;
        }

      } catch (e) {

        window.location.href = "/login";
        refreshTokenService.removeRefreshToken();
        tokenService.removeAccessToken();
        alert("로그인이 필요합니다.");
        setIsLogin(false);
        return Promise.reject(e);
      }
      return response;
    },
  },
});

export default fetchExtended;
```