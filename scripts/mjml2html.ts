import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from 'path';
import processExec from 'child_process';

async function main() {
  const argv: any = yargs(hideBin(process.argv)).demandOption(
    ['inpath', 'outpath'],
    'Please provide path arguments'
  ).argv;
  // 收集所有的文件路径
  const arr: string[] = [];
  let timer: any = null;

  const fileDisplay = (url: string, cb: (arg0: string[]) => any) => {
    const filePath = path.resolve(url);
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, (err, files) => {
      if (err) return console.error('Error:(spec)', err)
      files.forEach((filename) => {
        //获取当前文件的绝对路径
        const filedir = path.join(filePath, filename);
        // fs.stat(path)执行后，会将stats类的实例返回给其回调函数。
        fs.stat(filedir, (eror, stats) => {
          if (eror) return console.error('Error:(spec)', err);
          // 是否是文件
          const isFile = stats.isFile();
          // 是否是文件夹
          const isDir = stats.isDirectory();
          if (isFile) {
            // 这块我自己处理了多余的绝对路径，第一个 replace 是替换掉那个路径，第二个是所有满足\\的直接替换掉
            arr.push(filedir.replace(__dirname, '').replace(/\\/img, '/'));
            // 最后打印的就是完整的文件路径了
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => cb && cb(arr), 200)
          }
          // 如果是文件夹
          if (isDir) fileDisplay(filedir, cb);
        })
      });
    });
  }
  fileDisplay(argv.inpath, (arr)=> {
    console.log(arr)
    arr.forEach(path => {
      const splitStr = argv.inpath.startsWith('./') ? argv.inpath.substring(1) : argv.inpath;
      const paths = path.split(splitStr);
      const lastIndex = paths[1].lastIndexOf('/');
      const subPath = paths[1].substring(0, lastIndex + 1);
      const [fileName] = paths[1].substring(lastIndex + 1).split('.');

      fs.stat(`${argv.outpath}/${subPath}`, async (_, stats) => {
        if (!stats) {
          // 不存在创建文件夹
          fs.mkdir(`${argv.outpath}/${subPath}`, { recursive: true }, err => {
            if (err) {
              console.error(err);
            } else {
              try {
                const cmd = `mjml ${argv.inpath}${paths[1]} -o ${argv.outpath}${subPath}${fileName}.html`;
                console.log('$'+cmd);
                console.log(processExec.execSync(cmd).toString());
              } catch (e) {
                console.log(e);
              }
            }
          });
        } else {
          try {
            const cmd = `mjml ${argv.inpath}${paths[1]} -o ${argv.outpath}${subPath}${fileName}.html`;
            console.log('$'+cmd);
            console.log(processExec.execSync(cmd).toString());
          } catch (e) {
            console.log(e);
          }
        }
      });
    })
  });
}
main();