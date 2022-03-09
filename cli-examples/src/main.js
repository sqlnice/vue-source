import Vue from "vue";
import App from "./App.vue";

// 一：
// Vue.component("async-webpack-example", function (resolve) {
//   // 这个特殊的 `require` 语法将会告诉 webpack
//   // 自动将你的构建代码切割成多个包，这些包
//   // 会通过 Ajax 请求加载
//   require(["./components/AsyncComponent.vue"], resolve);
// });

// 二：
// Vue.component(
//   "async-webpack-example",
//   // 这个动态导入会返回一个 `Promise` 对象。
//   () => import("./components/AsyncComponent.vue")
// );

// 三：高级异步组件
// const AsyncComponent = () => ({
//   // 需要加载的组件 (应该是一个 `Promise` 对象)
//   component: import("./components/AsyncComponent.vue"),
//   // 异步组件加载时使用的组件
//   loading: {
//     name: "loadingComp",
//   },
//   // 加载失败时使用的组件
//   error: {
//     name: "errorComp",
//   },
//   // 展示加载时组件的延时时间。默认值是 200 (毫秒)
//   delay: 0,
//   // 如果提供了超时时间且组件加载也超时了，
//   // 则使用加载失败时使用的组件。默认值是：`Infinity`
//   timeout: 3000,
// });
// Vue.component("async-example", AsyncComponent);
new Vue({
  el: "#app",
  render: (h) => h(App),
});
