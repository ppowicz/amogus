import IMenuItem from './interfaces/IMenuItem';
import IUser from './interfaces/IUser';
import { QueryClient, useMutation, UseMutationResult, useQuery, UseQueryResult } from 'react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0
        }
    }
});

const apiUrl = window.location.hostname.includes('localhost') ? 'http://localhost:8080' : 'https://pizzeria.cubepotato.eu';

type LoginRegisterData = { email: string; password: string };

type Route<TRes = any, TData = never> = {
    method: 'get' | 'post' | 'delete' | 'put';
    url: string;
};

function newRoute<TRes = any, TData = any>(url: string, method: Route['method'] = 'get'): Route<TRes, TData> {
    return { method, url };
}

export const apiPaths = {
    menu: newRoute<IMenuItem[]>('/menu'),
    loginByEmail:  newRoute<any, LoginRegisterData>('/auth/login', 'post'),
    registerByEmail:  newRoute<any, LoginRegisterData>('/auth/register', 'post'),
    logout: "/auth/logout",
    me: newRoute<IUser>('/auth/me'),
    providers: "/auth/providers",
};

function generateQuery(obj: Record<string, any>) {
    let params = new URLSearchParams();
    for(let key in obj)
        params.append(key, obj[key]);
    return params;
}

export async function invoke<TRes, TData>(_route: Route<TRes, TData> | string, data?: TData): Promise<TRes> {
    let route: Route;
    if (typeof _route === 'string') {
        route = {method: 'get', url: _route as string};
    } else route = _route as Route;

    const query = (route.method === 'get' && data) ? generateQuery(data) : '';

    const req = await fetch(apiUrl + route.url + query, {
        method: route.method,
        body: ['post', 'put'].includes(route.method) ? JSON.stringify(data) : undefined,
        headers: {
            'Content-Type': ['post', 'put'].includes(route.method) ? 'application/json' : undefined,
        } as any,
        credentials: "include"
    });

    if(req.status !== 200) {
        throw new Error((await req.json())?.message || req.status.toString());
    }

    if(req.headers.get('Content-Type')?.includes('application/json'))
        return await req.json();
    return (await req.text()) as any;
}

export function useApi<TRes, TData>(route: Route<TRes, TData>, getData?: () => TData): UseQueryResult<TRes> {
    return useQuery(route.url, () => invoke(route, getData ? getData() : undefined));
}

export const callProvider = (provider: string) => {
    document.location.href = apiUrl + "?provider=" + provider;
};
