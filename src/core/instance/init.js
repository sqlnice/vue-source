/* @flow */

import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

let uid = 0

export function initMixin (Vue: Class<Component>) {
  // 给Vue的原型prototype添加 _init方法，在new Vue初始化实例时调用
  Vue.prototype._init = function (options?: Object) {
    // this指实例本身
    const vm: Component = this
    // a uid 防止多个Vue实例冲突
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // 标识符，防止被数据观察处理
    vm._isVue = true
    // 合并配置
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      // 得到 Vue.otpions 对象
      // 把 Vue 的 options 和用户传入的 options 做合并处理
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      // 设置代理，将 vm 实例上的属性代理到 vm._renderProxy，用 ES6 的 Proxy 实现的
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    // 初始化实例上的一些关键属性，如_inactive/_isMounted/_isDestroyed
    // 组件上的关系，如$parent/$root/$children/$refs
    initLifecycle(vm)

    // 初始化自定义事件
    initEvents(vm)

    // 初始化渲染需要用到的重要方法：vm.$createElement
    initRender(vm)

    // 调用 beforeCreate 生命周期钩子
    callHook(vm, 'beforeCreate')

    // 初始化组件上的 inject 选项，把这个东西处理成 result[key] = val 的标准形式，
    // 然后对这个 result 做数据响应式处理，代理每个 key 到 vm
    initInjections(vm) // resolve injections before data/props

    // 处理数据响应式的重点，初始化data、props、methods、computed、watch
    initState(vm)

    // 解析组件上的 provide，这个 provide 有点像 react 的 Provider，是跨组件深层传递数据的
    // 同样，把解析结果代理到 vm._provide 上；
    // 这里多说一点，为啥先初始化 initInjections 后初始化 initProvide 呢？
    // 他之所以敢这么干是因为 inject 在子组件上，而 provide 在父组件上，而父组件先于子组件被
    // 处理所以当 inject 后初始化没问题，因为他取用的是父组件上的 provide，
    // 此时父组件的 provide 早已经初始化完成了
    initProvide(vm) // resolve provide after data/props

    // 调用 created 生命周期钩子
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }
    // 执行到如果，如果有
    // new Vue({
    //   el: "#app",
    // });
    // 则调用$mount 挂载vm，挂载的目标就是把模板渲染成最终的DOM
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  const latest = Ctor.options
  const extended = Ctor.extendOptions
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = dedupe(latest[key], extended[key], sealed[key])
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    const res = []
    sealed = Array.isArray(sealed) ? sealed : [sealed]
    extended = Array.isArray(extended) ? extended : [extended]
    for (let i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i])
      }
    }
    return res
  } else {
    return latest
  }
}
