# React web basic

Project created with [Vite](https://vitejs.dev/)

## Getting started

```sh
$ git clone https://gitlab.meta.com.br/meta/smart/react/react-web/react-web-basic.git
$ cd react-web-basic
$ pnpm install
```

## Scripts:

```sh
$ pnpm dev # run development server

$ pnpm build # create dist directory with bundle

$ pnpm test # run all tests in watch mode
$ pnpm test run # run all tests one time

$ pnpm lint # run eslint to check code

$ pnpm release # upgrade project version and create changelog file

$ cd scripts && ./deploy.development # build development mode and provide it with nginx http://localhost:3000
$ cd scripts && ./deploy.staging # build staging mode and provide it with nginx http://localhost:3030
$ cd scripts && ./deploy.production # build production mode and provide it with nginx http://localhost:80
```
