# pandora-boilerplate-react

React SPA project boilerplate for pandolajs.

## Feature

- [x] viewport layout. found more details [here](https://www.w3cplus.com/css/vw-for-layout.html)
- [x] React 16.5 +
- [x] Redux
- [x] eslint
- [x] Less
- [x] local mock
- [x] universal router. found more details [here](https://github.com/pandolajs/generator-pandora-app/blob/master/docs/isomorphic-router.md)

## 初始化项目

### 全局安装 `pandora-cli` 构建工具

```bash
  npm i -g pandora-cli
```

### 安装项目依赖

```bash
  npm i
```

### 启动开发环境

```bash
  pa start
```

### 构建生产(prod) | 预发(pre) | 测试环境(test) 代码

```bash
  pa build --env prod
```

## 开发指南

### 目录结构介绍

```bash
  .
  ├── mock                    // mock 数据目录
  └── src
      ├── common              // 通用目录
      ├── components          // 组件目录
      ├── pages               // 页面目录
      ├── routes              // 前端路由目录
      └── services            // 接口封装目录
```

### 开发规范

- 视图组件位于 components 目录中，可复用，数据只能通过 props 进行传入，一般在 pages 中使用，不可在 routes 中直接引用这类型组件

- 容器组件位于 pages 目录中，通常在 routes 中使用, 禁止在容器组件中直接调用 services 接口

- serveices 后端接口封装层，所有与后端接口交互的逻辑均在此目录中进行封装，完成数据组装，格式化后，在 routes 层进行数据与组件的组装

- routes 用来定义页面路由，完成数据层与视图层的组装

- mock 用来定义后端接口 mock 数据

### routes 定义

每个路由都是一个如下格式的对象

```javascript
  {
    path: '/home/:name',
    action (context, params) {
      return {
        title: 'page title',
        component: (<Page someprops={...} />)
      }
    }
  }
```

> Note: more details read [here](https://www.kriasoft.com/universal-router/api)

### mock 定义

没有后端接口定义一个 mock 文件，格式如下：

```javascript
  {
    path: 'get::/backend/mock/api',
    action (context) {
      return {
        key: 'the data you want to define'
      }
    }
  }
```

定义好 mock 数据就可以在 services 中，通过 fetch('/backend/mock/api', { ...some params }) 方法来获取 mock 数据

### others

- 目前项目中存在一个全局变量 `_DEV_` 用来表示是否为开发环境，如果未开发环境 `_DEV_` 为 `true`, 否则为 `false`

- 此项目的路由前缀是 `open` 所有在 routes 中定义的路由均需加此前缀才能访问，有如下路由定义：

```javascript
  {
    path: '/home/:name',
    action () {
      // some code
    }
  }
```

在项目启动后，需要在浏览器中通过 `http://localhost:8080/open/home/test` 才能访问到
