# eslint-plugin-omega-methods

## 1、使用说明
```shell
$ npm install eslint-plugin-omega-methods --save-dev
```


## 2、配置 ESLint
在项目的 .eslintrc.js 或 .eslintrc.json 中：

```javascript
module.exports = {
  plugins: ["omega-methods"],
  rules: {
    "omega-methods/omega-method-prefix": "error",
  },
};
```

## 3、支持的导出模式
1. export const/let 导出的函数
```javascript
// 正确
export const $omegaMyFunction = () => {};
export let $omegaAnotherFunction = function() {};

// 错误
export const myFunction = () => {};
export let anotherFunction = function() {};
```

2. export {} 导出的函数
```javascript
function $omegaCorrectFunction() {}
function incorrectFunction() {}

// 正确
export { $omegaCorrectFunction };

// 错误
export { incorrectFunction };
```
3. export default 导出的函数

```javascript
// 正确
export default function $omegaDefaultFunction() {}

// 错误
export default function defaultFunction() {}
```
