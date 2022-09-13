const fs = require('fs');
const path = require('path');

const patterns = [
  {
    pattern: /pxToRem\(([\d]+[\.]?[\d]*)\)/,
    replace1: (val) => `pxToRemTEMP(${val})`,
    replace2: /pxToRemTEMP/g,
    replace3: 'pxToRem',
  },
  {
    pattern: /([\d]+[\.]?[\d]*)rem/,
    replace1: (val) => `${val}TEMPrem`,
    replace2: /TEMPrem/g,
    replace3: 'rem',
  },
  {
    pattern: / m=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => ` mTEMP={${val}}`,
    replace2: / mTEMP=/g,
    replace3: ' m=',
  },
  {
    pattern: /mx=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => `mxTEMP={${val}}`,
    replace2: /mxTEMP=/g,
    replace3: 'mx=',
  },
  {
    pattern: /my=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => `myTEMP={${val}}`,
    replace2: /myTEMP=/g,
    replace3: 'my=',
  },
  {
    pattern: /mt=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => `mtTEMP={${val}}`,
    replace2: /mtTEMP=/g,
    replace3: 'mt=',
  },
  {
    pattern: /mb=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => `mbTEMP={${val}}`,
    replace2: /mbTEMP=/g,
    replace3: 'mb=',
  },
  {
    pattern: /ml=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => `mlTEMP={${val}}`,
    replace2: /mlTEMP=/g,
    replace3: 'ml=',
  },
  {
    pattern: /mr=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => `mrTEMP={${val}}`,
    replace2: /mrTEMP=/g,
    replace3: 'mr=',
  },
  {
    pattern: / p=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => ` pTEMP={${val}}`,
    replace2: / pTEMP=/g,
    replace3: ' p=',
  },
  {
    pattern: /px=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => `pxTEMP={${val}}`,
    replace2: /pxTEMP=/g,
    replace3: 'px=',
  },
  {
    pattern: /py=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => `pyTEMP={${val}}`,
    replace2: /pyTEMP=/g,
    replace3: 'py=',
  },
  {
    pattern: /pt=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => `ptTEMP={${val}}`,
    replace2: /ptTEMP=/g,
    replace3: 'pt=',
  },
  {
    pattern: /pb=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => `pbTEMP={${val}}`,
    replace2: /pbTEMP=/g,
    replace3: 'pb=',
  },
  {
    pattern: /pl=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => `plTEMP={${val}}`,
    replace2: /plTEMP=/g,
    replace3: 'pl=',
  },
  {
    pattern: /pr=\{([\d]+[\.]?[\d]*)\}/,
    replace1: (val) => `prTEMP={${val}}`,
    replace2: /prTEMP=/g,
    replace3: 'pr=',
  },
  {
    pattern: /([\d]+[\.]?[\d]*)px/,
    replace1: (val) => `${val}TEMPpx`,
    replace2: /TEMPpx/g,
    replace3: 'px',
  },
];

const zoom = 0.8;

function fromDir(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log('no dir ', startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      fromDir(filename, filter);
    } else if (filename.endsWith(filter)) {
      var buffer = fs.readFileSync(filename);
      var content = buffer.toString();
      var replaced = 0;
      for (const pattern of patterns) {
        while (pattern.pattern.test(content)) {
          var size = Number(
            pattern.pattern.exec(content)[1],
          );
          content = content.replace(
            pattern.pattern,
            pattern.replace1(
              Number((size * zoom).toFixed(2)),
            ),
          );
          replaced++;
        }
        content = content.replace(
          pattern.replace2,
          pattern.replace3,
        );
      }
      fs.writeFileSync(filename, content);
      if (replaced) {
        console.log('-- found: ', filename);
        console.log(`>>>`, replaced, `replaced.`);
      }
    }
  }
}

const exts = ['.tsx', '.ts'];
const paths = [
  '../main/frontend/src/mui/',
  '../main/frontend/src/view/',
];

for (const path of paths) {
  for (const ext of exts) {
    fromDir(path, ext);
  }
}
