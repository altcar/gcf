import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter__gOFsw0V.mjs';
import { manifest } from './manifest_Bxojd-oE.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/chocolate.astro.mjs');
const _page2 = () => import('./pages/api/company.astro.mjs');
const _page3 = () => import('./pages/api/register.astro.mjs');
const _page4 = () => import('./pages/chocolate.astro.mjs');
const _page5 = () => import('./pages/company/bedesign.astro.mjs');
const _page6 = () => import('./pages/company/enactus.astro.mjs');
const _page7 = () => import('./pages/company/laing.astro.mjs');
const _page8 = () => import('./pages/company/mm.astro.mjs');
const _page9 = () => import('./pages/company/placement.astro.mjs');
const _page10 = () => import('./pages/company/res.astro.mjs');
const _page11 = () => import('./pages/company/rps.astro.mjs');
const _page12 = () => import('./pages/dashboard.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/chocolate.ts", _page1],
    ["src/pages/api/company.ts", _page2],
    ["src/pages/api/register.ts", _page3],
    ["src/pages/chocolate.astro", _page4],
    ["src/pages/company/bedesign.astro", _page5],
    ["src/pages/company/enactus.astro", _page6],
    ["src/pages/company/laing.astro", _page7],
    ["src/pages/company/mm.astro", _page8],
    ["src/pages/company/placement.astro", _page9],
    ["src/pages/company/res.astro", _page10],
    ["src/pages/company/rps.astro", _page11],
    ["src/pages/dashboard.astro", _page12],
    ["src/pages/index.astro", _page13]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "0dc1b498-450f-4d01-8411-eef63755a1e1",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
