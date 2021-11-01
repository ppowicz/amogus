import React, { createRef, forwardRef, useImperativeHandle } from 'react';

export function globalHook<T>(hook: () => T) {
    const ref = createRef<T>();

    const Inner = forwardRef((props, ref) => {
        const data = hook();

        useImperativeHandle(
            ref,
            () => data,
            [data],
        );

        return null;
    });

    const Provider = () => {
        return <Inner ref={ref} />;
   }

   return { Provider, ref };
}