import { useEffect, useRef, useState } from "react";


interface RequestOptions<T, K> {
  request: (data?: T | Record<string, never>) => Promise<K>;
  initParams?: T | Record<string, never>;
}
interface ResponseOptions<T, K> {
  onSucess?: (data: K, params: T | Record<string, never>) => void;
  onError?: (err) => void;
}
const useRequest = <T, K>(
  requestOptions: RequestOptions<T, K>,
  responseOptions?: ResponseOptions<T, K>
) => {
  const { initParams, request } = requestOptions;
  const { onSucess, onError } = responseOptions || {};
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  const [data, setData] = useState<K>();
  // const [params, setParams] = useState<T | Record<string, never>>(initParams);
  const dispatchRequest = async (params: T | Record<string, never>) => {
    try {
      await setLoading(true);
      const data = await request(params);
      await setData(data);
      onSucess?.(data, params);
      await setLoading(false);
    } catch (err) {
      onError?.(err);
      await setLoading(false);
    }
  };
  useEffect(() => {
    // 如果initParams不传的话，就不请求
    if (!initParams && isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    dispatchRequest(initParams);
  }, []);

  const run = async (params: T | Record<string, never> = {}) => {
    // setParams(() => params);
    await dispatchRequest(params)
    // return new Promise((resolve) => {
    //   resolve(dispatchRequest());
    // });
  };

  return { loading, data, run };
};

export default useRequest;
