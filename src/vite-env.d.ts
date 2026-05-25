/// <reference types="vite/client" />

// Globals provided by the 酒馆 (Tavern) runtime environment
/* eslint-disable @typescript-eslint/no-explicit-any */
declare const $: any;
declare function errorCatched<T extends (...args: any[]) => any>(fn: T): T;
