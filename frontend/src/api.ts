import IMenuItem from './interfaces/IMenuItem';
import IUser from './interfaces/IUser';
import { QueryClient, useQuery, UseQueryResult } from 'react-query';
import { snackbar } from './components/GlobalSnackbar';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
        },
        mutations: {
            onError: (err) => {
                console.log(err);
                snackbar().enqueueSnackbar(`Something went wrong (${err})`, {
                    variant: 'error',
                    autoHideDuration: 2000,
                });
            }
        }
    },
});

const apiUrl = window.location.hostname.includes('localhost') ? 'http://localhost:8080' : 'https://pizzeria.cubepotato.eu';

type LoginRegisterData = { email: string; password: string };

type Route<TRes = any, TData = never> = {
    method: 'get' | 'post' | 'delete' | 'put';
    path: string;
    with: (k: string, v: string) => Route;
};

function withParam(route: Route, k: string, v: string) {
    return { ...route, path: route.path.replaceAll(`{${k}}`, v) };
}

function newRoute<TRes = any, TData = any>(url: string, method: Route['method'] = 'get'): Route<TRes, TData> {
    const res = { method, path: url } as Route;
    res.with = (k: string, v: string) => withParam(res, k, v)
    return res;
}

export const apiPaths = {
    menu: newRoute<IMenuItem[]>('/menu'),
    loginByEmail: newRoute<any, LoginRegisterData>('/auth/login', 'post'),
    registerByEmail: newRoute<any, LoginRegisterData>('/auth/register', 'post'),
    logout: "/auth/logout",
    me: newRoute<IUser>('/auth/me'),
    providers: "/auth/providers",

    addMenuItem: newRoute<IMenuItem, IMenuItem>('/menu', 'post'),
    editMenuItem: newRoute<IMenuItem, IMenuItem>('/menu', 'put'),
    deleteMenuItem: newRoute<IMenuItem>('/menu/{id}', 'delete')
};

function generateQuery(obj: Record<string, any>) {
    let params = new URLSearchParams();
    for (let key in obj)
        params.append(key, obj[key]);
    return params;
}

export async function invoke<TRes, TData, TParams>(_route: Route<TRes, TData> | string, data?: TData): Promise<TRes> {
    let route: Route;
    if (typeof _route === 'string') {
        route = { method: 'get', path: _route as string, with: () => route };
    } else route = _route as Route;

    const query = (route.method === 'get' && data) ? generateQuery(data) : '';

    const req = await fetch(apiUrl + route.path + query, {
        method: route.method,
        body: ['post', 'put'].includes(route.method) ? JSON.stringify(data) : undefined,
        headers: {
            'Content-Type': ['post', 'put'].includes(route.method) ? 'application/json' : undefined,
        } as any,
        credentials: "include"
    });

    if (req.status !== 200) {
        throw new Error((await req.json())?.message || req.status.toString());
    }

    if (req.headers.get('Content-Type')?.includes('application/json'))
        return await req.json();
    return (await req.text()) as any;
}

export function useApi<TRes, TData>(route: Route<TRes, TData>, getData?: () => TData): UseQueryResult<TRes> {
    return useQuery(route.path, () => invoke(route, getData ? getData() : undefined));
}

export const callProvider = (provider: string) => {
    document.location.href = apiUrl + "?provider=" + provider;
};
