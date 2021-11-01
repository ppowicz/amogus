import React from 'react';
import { Navigate, Route, RouteProps } from 'react-router-dom';
import { apiPaths, useApi } from '../api';
import NotFound from '../views/NotFound';

export function PrivateElement({element}: Pick<RouteProps, 'element'>) {
    const { data: user } = useApi(apiPaths.me);

    if(user && user.role >= 1) {
        return element;
    }

    return <NotFound />;
}
