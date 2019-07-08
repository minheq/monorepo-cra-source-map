# Monorepo debugging with Create React App in Typescript
By overriding webpack configuration, CRA will generate correct sourcemap for local packages, effectively giving you the ability to debug packages in VSCode from CRA and correct sourcemap for sentry or bugsnag.

![Recording](https://user-images.githubusercontent.com/9356633/60150702-ea9d1e00-9803-11e9-99d3-e9a1f2ab6936.gif)

## Try it out

Install deps

```bash
yarn
```

Go to `packages/cra` and run

```
yarn start
```

In VSCode, press `F5` to launch the debugger

Then put breakpoints wherever you want

## How

Have a regular lerna setup with 2 packages `cra` and `component`

When importing from another package, point it to **untranspiled** version, by specifying `module`

```json
// packages/component/package.json
{
  ...
  "module": "index.ts",
  ...
}
```

Use `react-app-rewired` to customize webpack configuration, to tell it to transpile imports from packages

```js
// packages/cra/config-overrides.js
const path = require("path");

module.exports = function override(config, env) {
  // https://github.com/facebook/create-react-app/blob/a88a4c3af6b6b8557845f147604a098d2857a91a/packages/react-scripts/config/webpack.config.js#L356-L404
  const tsConfig = config.module.rules[2].oneOf[1];

  const packagesDir = path.resolve(__dirname, "..");
  const srcDir = path.resolve(__dirname, "./src");

  tsConfig.include = [srcDir, packagesDir];

  return config;
};
```

## Reason

### Issue

When you `yarn build` in CRA, you will get a sourcemap that looks like this

```
# cra/build/static/js/main.*.chunk.js.map

{
  "version": 3,
  "sources": [
    "../../component/dist/Component.js",
    "App.tsx",
    "serviceWorker.ts",
    "index.tsx",
    "../../component/dist/index.js"
  ],
  "names": [
    ...
  ],
  "mappings": "...",
  "file": "static/js/main.da367f8a.chunk.js",
  "sourcesContent": [
    "\"use strict\";\n\nvar _slicedToArray = require(\"/Users/minheq/Documents/GitHub/monorepo-cra-source-map/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/slicedToArray\");\n\nvar __importDefault = this && this.__importDefault || function (mod) {\n  return mod && mod.__esModule ? mod : {\n    \"default\": mod\n  };\n};\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar react_1 = __importDefault(require(\"react\"));\n\nexports.Component = function () {\n  var _react_1$default$useS = react_1.default.useState(0),\n      _react_1$default$useS2 = _slicedToArray(_react_1$default$useS, 2),\n      count = _react_1$default$useS2[0],\n      setCount = _react_1$default$useS2[1];\n\n  return react_1.default.createElement(\"div\", null, react_1.default.createElement(\"span\", null, count));\n};",
    "import { Component } from '@monorepo/component';\nimport React from 'react';\n\nconst App = () => {\n  const text = \"text\";\n\n  return (\n    <div className=\"App\">\n      <Component />\n      <span>{text}</span>\n    </div>\n  );\n};\n\nexport default App;\n",
    "// This optional code is used to register a service worker.\n// register() is not called by default.\n\n// This lets the app load faster on subsequent visits in production, and gives\n// it offline capabilities. However, it also means that developers (and users)\n// will only see deployed updates on subsequent visits to a page, after all the\n// existing tabs open on the page have been closed, since previously cached\n// resources are updated in the background.\n\n// To learn more about the benefits of this model and instructions on how to\n// opt-in, read https://bit.ly/CRA-PWA\n\nconst isLocalhost = Boolean(\n  window.location.hostname === 'localhost' ||\n    // [::1] is the IPv6 localhost address.\n    window.location.hostname === '[::1]' ||\n    // 127.0.0.1/8 is considered localhost for IPv4.\n    window.location.hostname.match(\n      /^127(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/\n    )\n);\n\ntype Config = {\n  onSuccess?: (registration: ServiceWorkerRegistration) => void;\n  onUpdate?: (registration: ServiceWorkerRegistration) => void;\n};\n\nexport function register(config?: Config) {\n  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {\n    // The URL constructor is available in all browsers that support SW.\n    const publicUrl = new URL(\n      (process as { env: { [key: string]: string } }).env.PUBLIC_URL,\n      window.location.href\n    );\n    if (publicUrl.origin !== window.location.origin) {\n      // Our service worker won't work if PUBLIC_URL is on a different origin\n      // from what our page is served on. This might happen if a CDN is used to\n      // serve assets; see https://github.com/facebook/create-react-app/issues/2374\n      return;\n    }\n\n    window.addEventListener('load', () => {\n      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;\n\n      if (isLocalhost) {\n        // This is running on localhost. Let's check if a service worker still exists or not.\n        checkValidServiceWorker(swUrl, config);\n\n        // Add some additional logging to localhost, pointing developers to the\n        // service worker/PWA documentation.\n        navigator.serviceWorker.ready.then(() => {\n          console.log(\n            'This web app is being served cache-first by a service ' +\n              'worker. To learn more, visit https://bit.ly/CRA-PWA'\n          );\n        });\n      } else {\n        // Is not localhost. Just register service worker\n        registerValidSW(swUrl, config);\n      }\n    });\n  }\n}\n\nfunction registerValidSW(swUrl: string, config?: Config) {\n  navigator.serviceWorker\n    .register(swUrl)\n    .then(registration => {\n      registration.onupdatefound = () => {\n        const installingWorker = registration.installing;\n        if (installingWorker == null) {\n          return;\n        }\n        installingWorker.onstatechange = () => {\n          if (installingWorker.state === 'installed') {\n            if (navigator.serviceWorker.controller) {\n              // At this point, the updated precached content has been fetched,\n              // but the previous service worker will still serve the older\n              // content until all client tabs are closed.\n              console.log(\n                'New content is available and will be used when all ' +\n                  'tabs for this page are closed. See https://bit.ly/CRA-PWA.'\n              );\n\n              // Execute callback\n              if (config && config.onUpdate) {\n                config.onUpdate(registration);\n              }\n            } else {\n              // At this point, everything has been precached.\n              // It's the perfect time to display a\n              // \"Content is cached for offline use.\" message.\n              console.log('Content is cached for offline use.');\n\n              // Execute callback\n              if (config && config.onSuccess) {\n                config.onSuccess(registration);\n              }\n            }\n          }\n        };\n      };\n    })\n    .catch(error => {\n      console.error('Error during service worker registration:', error);\n    });\n}\n\nfunction checkValidServiceWorker(swUrl: string, config?: Config) {\n  // Check if the service worker can be found. If it can't reload the page.\n  fetch(swUrl)\n    .then(response => {\n      // Ensure service worker exists, and that we really are getting a JS file.\n      const contentType = response.headers.get('content-type');\n      if (\n        response.status === 404 ||\n        (contentType != null && contentType.indexOf('javascript') === -1)\n      ) {\n        // No service worker found. Probably a different app. Reload the page.\n        navigator.serviceWorker.ready.then(registration => {\n          registration.unregister().then(() => {\n            window.location.reload();\n          });\n        });\n      } else {\n        // Service worker found. Proceed as normal.\n        registerValidSW(swUrl, config);\n      }\n    })\n    .catch(() => {\n      console.log(\n        'No internet connection found. App is running in offline mode.'\n      );\n    });\n}\n\nexport function unregister() {\n  if ('serviceWorker' in navigator) {\n    navigator.serviceWorker.ready.then(registration => {\n      registration.unregister();\n    });\n  }\n}\n",
    "import React from 'react';\nimport ReactDOM from 'react-dom';\n\nimport App from './App';\nimport * as serviceWorker from './serviceWorker';\n\nReactDOM.render(<App />, document.getElementById(\"root\"));\n\n// If you want your app to work offline and load faster, you can change\n// unregister() to register() below. Note this comes with some pitfalls.\n// Learn more about service workers: https://bit.ly/CRA-PWA\nserviceWorker.unregister();\n",
    "\"use strict\";\n\nfunction __export(m) {\n  for (var p in m) {\n    if (!exports.hasOwnProperty(p)) exports[p] = m[p];\n  }\n}\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\n__export(require(\"./Component\"));"
  ],
  "sourceRoot": ""
}

```

In `sources` you will notice that webpack resolved to the symlinked and transpiled version of `../../component/dist/Component.js`

and in `sourceContent` the transpiled content of it
```
"\"use strict\";\n\nvar _slicedToArray = require(\"/Users/minheq/Documents/GitHub/monorepo-cra-source-map/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/slicedToArray\");\n\nvar __importDefault = this && this.__importDefault || function (mod) {\n  return mod && mod.__esModule ? mod : {\n    \"default\": mod\n  };\n};\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar react_1 = __importDefault(require(\"react\"));\n\nexports.Component = function () {\n  var _react_1$default$useS = react_1.default.useState(0),\n      _react_1$default$useS2 = _slicedToArray(_react_1$default$useS, 2),\n      count = _react_1$default$useS2[0],\n      setCount = _react_1$default$useS2[1];\n\n  return react_1.default.createElement(\"div\", null, react_1.default.createElement(\"span\", null, count));\n};",
```

### Solution

By applying the workaround, we get correct path to `Component.tsx` and its `sourceContent`

```
{
  "version": 3,
  "sources": [
    "../../component/Component.tsx",
    "App.tsx",
    "serviceWorker.ts",
    "index.tsx"
  ],
  "names": [
    ...
  ],
  "mappings": "...",
  "file": "static/js/main.915667bc.chunk.js",
  "sourcesContent": [
    "import React from 'react';\n\nexport const Component = () => {\n  const [count, setCount] = React.useState(0);\n\n  return (\n    <div>\n      <span>{count}</span>\n      <button onClick={() => setCount(count + 1)}>click</button>\n    </div>\n  );\n};\n",
    "import { Component } from '@monorepo/component';\nimport React from 'react';\n\nconst App = () => {\n  const text = \"text\";\n\n  return (\n    <div className=\"App\">\n      <Component />\n      <span>{text}</span>\n    </div>\n  );\n};\n\nexport default App;\n",
    "// This optional code is used to register a service worker.\n// register() is not called by default.\n\n// This lets the app load faster on subsequent visits in production, and gives\n// it offline capabilities. However, it also means that developers (and users)\n// will only see deployed updates on subsequent visits to a page, after all the\n// existing tabs open on the page have been closed, since previously cached\n// resources are updated in the background.\n\n// To learn more about the benefits of this model and instructions on how to\n// opt-in, read https://bit.ly/CRA-PWA\n\nconst isLocalhost = Boolean(\n  window.location.hostname === 'localhost' ||\n    // [::1] is the IPv6 localhost address.\n    window.location.hostname === '[::1]' ||\n    // 127.0.0.1/8 is considered localhost for IPv4.\n    window.location.hostname.match(\n      /^127(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/\n    )\n);\n\ntype Config = {\n  onSuccess?: (registration: ServiceWorkerRegistration) => void;\n  onUpdate?: (registration: ServiceWorkerRegistration) => void;\n};\n\nexport function register(config?: Config) {\n  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {\n    // The URL constructor is available in all browsers that support SW.\n    const publicUrl = new URL(\n      (process as { env: { [key: string]: string } }).env.PUBLIC_URL,\n      window.location.href\n    );\n    if (publicUrl.origin !== window.location.origin) {\n      // Our service worker won't work if PUBLIC_URL is on a different origin\n      // from what our page is served on. This might happen if a CDN is used to\n      // serve assets; see https://github.com/facebook/create-react-app/issues/2374\n      return;\n    }\n\n    window.addEventListener('load', () => {\n      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;\n\n      if (isLocalhost) {\n        // This is running on localhost. Let's check if a service worker still exists or not.\n        checkValidServiceWorker(swUrl, config);\n\n        // Add some additional logging to localhost, pointing developers to the\n        // service worker/PWA documentation.\n        navigator.serviceWorker.ready.then(() => {\n          console.log(\n            'This web app is being served cache-first by a service ' +\n              'worker. To learn more, visit https://bit.ly/CRA-PWA'\n          );\n        });\n      } else {\n        // Is not localhost. Just register service worker\n        registerValidSW(swUrl, config);\n      }\n    });\n  }\n}\n\nfunction registerValidSW(swUrl: string, config?: Config) {\n  navigator.serviceWorker\n    .register(swUrl)\n    .then(registration => {\n      registration.onupdatefound = () => {\n        const installingWorker = registration.installing;\n        if (installingWorker == null) {\n          return;\n        }\n        installingWorker.onstatechange = () => {\n          if (installingWorker.state === 'installed') {\n            if (navigator.serviceWorker.controller) {\n              // At this point, the updated precached content has been fetched,\n              // but the previous service worker will still serve the older\n              // content until all client tabs are closed.\n              console.log(\n                'New content is available and will be used when all ' +\n                  'tabs for this page are closed. See https://bit.ly/CRA-PWA.'\n              );\n\n              // Execute callback\n              if (config && config.onUpdate) {\n                config.onUpdate(registration);\n              }\n            } else {\n              // At this point, everything has been precached.\n              // It's the perfect time to display a\n              // \"Content is cached for offline use.\" message.\n              console.log('Content is cached for offline use.');\n\n              // Execute callback\n              if (config && config.onSuccess) {\n                config.onSuccess(registration);\n              }\n            }\n          }\n        };\n      };\n    })\n    .catch(error => {\n      console.error('Error during service worker registration:', error);\n    });\n}\n\nfunction checkValidServiceWorker(swUrl: string, config?: Config) {\n  // Check if the service worker can be found. If it can't reload the page.\n  fetch(swUrl)\n    .then(response => {\n      // Ensure service worker exists, and that we really are getting a JS file.\n      const contentType = response.headers.get('content-type');\n      if (\n        response.status === 404 ||\n        (contentType != null && contentType.indexOf('javascript') === -1)\n      ) {\n        // No service worker found. Probably a different app. Reload the page.\n        navigator.serviceWorker.ready.then(registration => {\n          registration.unregister().then(() => {\n            window.location.reload();\n          });\n        });\n      } else {\n        // Service worker found. Proceed as normal.\n        registerValidSW(swUrl, config);\n      }\n    })\n    .catch(() => {\n      console.log(\n        'No internet connection found. App is running in offline mode.'\n      );\n    });\n}\n\nexport function unregister() {\n  if ('serviceWorker' in navigator) {\n    navigator.serviceWorker.ready.then(registration => {\n      registration.unregister();\n    });\n  }\n}\n",
    "import React from 'react';\nimport ReactDOM from 'react-dom';\n\nimport App from './App';\nimport * as serviceWorker from './serviceWorker';\n\nReactDOM.render(<App />, document.getElementById(\"root\"));\n\n// If you want your app to work offline and load faster, you can change\n// unregister() to register() below. Note this comes with some pitfalls.\n// Learn more about service workers: https://bit.ly/CRA-PWA\nserviceWorker.unregister();\n"
  ],
  "sourceRoot": ""
}
```
