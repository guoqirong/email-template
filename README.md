# email-template

## 语法

多语言语法
${{ aa.bb }}$
其中 aa 为文件名，bb 为多语言词条 key

## gulp

// 定义一个 task,声明它的名称, 任务依赖, 和任务内容.
gulp.task(name[, deps], fn)

// 读取文件,参数为文件路径字符串或数组, 支持通配符.
gulp.src(globs[, options])

// 写入文件, 作为pipe的一个流程.文件夹不存在时会被自动创建.
gulp.dest(path[, options])

// 监控文件,执行任务.
gulp.watch(glob [, opts], tasks) or gulp.watch(glob [, opts, cb])
