import 'piccolore';
import { p as decodeKey } from './chunks/astro/server_DUfVTkGB.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_DljOhoqE.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///workspaces/codespaces-blank/virtual-venus/","cacheDir":"file:///workspaces/codespaces-blank/virtual-venus/node_modules/.astro/","outDir":"file:///workspaces/codespaces-blank/virtual-venus/dist/","srcDir":"file:///workspaces/codespaces-blank/virtual-venus/src/","publicDir":"file:///workspaces/codespaces-blank/virtual-venus/public/","buildClientDir":"file:///workspaces/codespaces-blank/virtual-venus/dist/client/","buildServerDir":"file:///workspaces/codespaces-blank/virtual-venus/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"chocolate/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/chocolate","isIndex":false,"type":"page","pattern":"^\\/chocolate\\/?$","segments":[[{"content":"chocolate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/chocolate.astro","pathname":"/chocolate","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"company/bedesign/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/company/bedesign","isIndex":false,"type":"page","pattern":"^\\/company\\/bedesign\\/?$","segments":[[{"content":"company","dynamic":false,"spread":false}],[{"content":"bedesign","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/company/bedesign.astro","pathname":"/company/bedesign","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"dashboard/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/dashboard","isIndex":false,"type":"page","pattern":"^\\/dashboard\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard.astro","pathname":"/dashboard","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/chocolate","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/chocolate\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"chocolate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/chocolate.ts","pathname":"/api/chocolate","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/company","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/company\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"company","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/company.ts","pathname":"/api/company","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/register","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/register\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/register.ts","pathname":"/api/register","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/workspaces/codespaces-blank/virtual-venus/src/pages/chocolate.astro",{"propagation":"none","containsHead":true}],["/workspaces/codespaces-blank/virtual-venus/src/pages/company/bedesign.astro",{"propagation":"none","containsHead":true}],["/workspaces/codespaces-blank/virtual-venus/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/chocolate@_@ts":"pages/api/chocolate.astro.mjs","\u0000@astro-page:src/pages/api/company@_@ts":"pages/api/company.astro.mjs","\u0000@astro-page:src/pages/api/register@_@ts":"pages/api/register.astro.mjs","\u0000@astro-page:src/pages/chocolate@_@astro":"pages/chocolate.astro.mjs","\u0000@astro-page:src/pages/company/bedesign@_@astro":"pages/company/bedesign.astro.mjs","\u0000@astro-page:src/pages/dashboard@_@astro":"pages/dashboard.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Dmc0Tuyn.mjs","/workspaces/codespaces-blank/virtual-venus/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BpVmS0TP.mjs","@astrojs/react/client.js":"_astro/client.CCqJHTmc.js","/workspaces/codespaces-blank/virtual-venus/src/pages/dashboard.astro?astro&type=script&index=0&lang.ts":"_astro/dashboard.astro_astro_type_script_index_0_lang.BUcTQIsF.js","/workspaces/codespaces-blank/virtual-venus/src/pages/dashboard.astro?astro&type=script&index=1&lang.ts":"_astro/dashboard.astro_astro_type_script_index_1_lang.OinZb4cs.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/workspaces/codespaces-blank/virtual-venus/src/pages/dashboard.astro?astro&type=script&index=0&lang.ts","(function(){const t=document.cookie.split(\"; \").find(o=>o.startsWith(\"email=\")),e=t?decodeURIComponent(t.split(\"=\")[1]):null,n=document.getElementById(\"login-message\");e&&n&&(n.textContent=`You are logged in as ${e}.`)})();"],["/workspaces/codespaces-blank/virtual-venus/src/pages/dashboard.astro?astro&type=script&index=1&lang.ts","(function(){const t=document.cookie.split(\"; \").find(c=>c.startsWith(\"registrationId=\")),e=t?decodeURIComponent(t.split(\"=\")[1]):null;e||window.location.replace(\"/\");const o=document.querySelector('img[alt=\"QR Code for Virtual Venus access\"]');o&&e&&(o.src=\"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\"+encodeURIComponent(e))})();"]],"assets":["/favicon.svg","/_astro/client.CCqJHTmc.js","/chocolate/index.html","/company/bedesign/index.html","/dashboard/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"wjpAK9Wks18DAdrgKA0NWOXGgQG5JSkLGZ09jxsIohY="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
