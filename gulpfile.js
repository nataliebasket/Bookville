//Подключаем пакеты, плагины
import gulp from "gulp";
import browserSync from "browser-sync"; //лок сервер + синхр браузера
import del from "del";
import plumber from "gulp-plumber";//перехватка ошибок
import htmlmin from "gulp-htmlmin";
import twig from "gulp-twig";
import data from "./source/template/data.js";

import postcss from "gulp-postcss";
import postImport from "postcss-import"
import postUrl from "postcss-url";
import postNested from "postcss-nested";

const { src, dest, watch, series, parallel} = gulp; //сокращение для обращения напрямую

//Задачи
export function copyImg () {
  return src("./source/img/**/*.{png,jpg}")
  .pipe(dest("public/img"))
}

//Обработка HTML
export function html () {
  return src("./source/*.html")
  .pipe(plumber())
  .pipe(twig({
    data: data
    }))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(dest("./public"))
  .pipe(browserSync.stream())
}

//Обработка CSS
export function styles () {
  return src("./source/styles/*.css", { sourcemaps: true })
    .pipe(plumber())
    .pipe(postcss([
      postImport(),
      postUrl(),
      postNested()
    ]))
    .pipe(dest("./public/styles", { sourcemaps: true }))
    .pipe(browserSync.stream());
}

//Удаление public
export function clear () {
  return del("./public");
}

//Сервер
export function server () {
  browserSync.init({
    server: {
        baseDir: "./public"//корневая папка, тут запускается сервер
    },
    notify: false,// уведомления
    ui: false// пользовательский интерфейс
});
}

//Наблюдатель
function watcher () {
  watch("./source/styles/**/*.css", series(styles));
  watch("./source/*.html", html);
}

export function copyOther () {
  return src([
    "./source/fonts/*.{woff2,woff}",
    "./source/svg/*.svg",
  ], {
    base: "./source"
  })
    .pipe(dest("./public"))
}

export default series (
  clear,
  copyImg,
  copyOther,
  html,
  styles,
  parallel (watcher, server)
);
