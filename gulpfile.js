const gulp = require('gulp')
const i18n = require('gulp-html-i18n')
const through2 = require('through2')
const fs = require('fs')
const path = require('path')

const defaultTask = function () {
  return gulp
    .src('./pages/html/**/*.html')
    .pipe(
      i18n({
        langDir: './locale',
        trace: true
      })
    )
    .pipe(through2.obj(rejectNoJson))
    .pipe(through2.obj(arHtmlAddStyle))
    .pipe(gulp.dest('./dist'))
}

// 屏蔽不存在的 json文件 - 生成html
function rejectNoJson(file, _, cb) {
  let fileName = path.basename(file._originPath_)
  fileName = fileName.substring(0, fileName.lastIndexOf('.'))
  try {
    fs.accessSync(
      path.resolve(__dirname, './locale', file._lang_, `${fileName}.json`),
      fs.constants.F_OK
    )
    cb(null, file)
  } catch (error) {
    cb(null, null)
  }
}
// 阿拉伯语
function arHtmlAddStyle(file, _, cb) {
  if (file._lang_ === 'ar') {
    let code = file.contents.toString()
    code = code.replace(
      /<\/head>/,
      '<style>body{ direction: rtl;text-align: right;}</style></head>'
    )
    file.contents = Buffer.from(code)
  }
  cb(null, file)
}

exports['gen:locales'] = defaultTask

