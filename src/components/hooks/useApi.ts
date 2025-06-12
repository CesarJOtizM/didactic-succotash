'use client';

import { useCallback, useEffect, useState } from 'react';
import { UseApiCall } from 'src/lib/schemas';

type UseApiOptions<P> = {
	autoFetch?: boolean;
	params: P;
};

type CustomError = Error | null;

interface UseApiResult<T, P> {
	loading: boolean;
	data: T | null;
	error: CustomError;
	fetch: (param: P) => Promise<{ data: T | null; controller: AbortController }>;
}

export const useApi = <T, P>(
	apiCall: (param: P) => UseApiCall<T>,
	options?: UseApiOptions<P>
): UseApiResult<T, P> => {
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<CustomError>(null);

	const fetch = useCallback(
		async (param: P): Promise<{ data: T | null; controller: AbortController }> => {
			const { call, controller } = apiCall(param);
			setLoading(true);

			try {
				const response = await call;
				setData(response.data);
				setError(null);
				return { data: response.data, controller };
			} catch (err) {
				setError(err as Error);
				return { data: null, controller };
			} finally {
				setLoading(false);
			}
		},
		[apiCall]
	);

	useEffect(() => {
		if (options?.autoFetch) {
			fetch(options.params);
		}
	}, [fetch, options?.autoFetch, options?.params]);

	return { loading, data, error, fetch };
};
