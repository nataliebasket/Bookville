//Подключаем пакеты, плагины
import gulp from "gulp";
import browserSync from "browser-sync"; //лок сервер + синхр браузера
import del from "del";
import plumber from "gulp-plumber";//перехватка ошибок
import htmlmin from "gulp-htmlmin";
import twig from "gulp-twig";
import data from "./source/template/data.js";

const { src, dest, watch, series, parallel} = gulp; //сокращение для обращения напрямую

//Задачи
export function copy() {
  return src("./source/*.html")//создаем файловый поток чтения
  .pipe(dest("./public"))
}

//Обработка HTML
export function html() {
  return src("./source/*.html")
  .pipe(plumber())
  .pipe(twig({
    data: data
    }))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(dest("./public"))
  .pipe(browserSync.stream())
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
export function watcher () {
  watch("./source/*.html", html);
}

export default series (
  clear,
  html,
  parallel(watcher, server)
);
