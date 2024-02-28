# UJS (TypeScript)

UMD JS work on the both Browser and NodeJs

## Install

```
// With yarn
yarn add git+https://github.com/mvanvu/ujs

// With NPM
npm install git+https://github.com/mvanvu/ujs
```

### Usage On Browser

```
<script src="dist/index.js">
    const { DateTime } = window.$ujs;
    console.log(DateTime.now());
</script>
```

### Usage On NodeJS

```
import { DateTime } from '@maivubc/ujs';
console.log(DateTime.now());
```

### Test

```
// Test all utils
yarn test

// Test for a util
yarn test datetime
```

See all the sample tests at: /test/core

### Documentation

[See all docs at /docs](docs/)
