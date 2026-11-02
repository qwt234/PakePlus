window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })
{
  "tauri": {
    "allowlist": {
      "all": false,
      "window": {
        "all": true,
        "create": true,
        "close": true,
        "hide": true,
        "show": true,
        "maximize": true,
        "minimize": true,
        "unmaximize": true,
        "unminimize": true,
        "set_title": true,
        "set_resizable": true
      },
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": true,
        "createDir": true,
        "scope": ["$APPDATA/*", "$DOCUMENT/*"]
      },
      "path": true,
      "http": {
        "all": false,
        "scope": ["https://*", "http://*"]
      },
      "shell": {
        "open": true
      }
    },
    "bundle": {
      "identifier": "com.bsnr.schoolfoodsafe",
      "name": "巴彦淖尔市校园食品安全数字化监管平台",
      "version": "1.0.0",
      "windows": {
        "webviewInstallMode": {
          "type": "embedBootstrapper",
          "webviewVersion": "109.0.1518.52"
        },
        "nsis": {
          "installerIcon": "",
          "uninstallerIcon": "",
          "installHeaderImage": "",
          "installSideImage": "",
          "displayLanguageSelector": false
        }
      },
      "macos": {
        "minimumSystemVersion": "10.14",
        "bundleIdentifier": "com.bsnr.schoolfoodsafe"
      }
    },
    "window": {
      "label": "main",
      "url": "/",
      "title": "巴彦淖尔市校园食品安全数字化监管平台",
      "width": 1280,
      "height": 720,
      "resizable": true,
      "fullscreen": false
    },
    "security": {
      "csp": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
    },
    "singleInstance": true
  }// PakePlus 文件导出/下载增强脚本
(function(){
    // 拦截页面所有a标签下载，修复桌面应用无法弹出保存对话框问题
    const originalClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function(){
        // 如果是下载链接，强制触发系统保存弹窗
        if(this.download && this.href){
            const link = document.createElement('a');
            link.href = this.href;
            link.download = this.download;
            // PakePlus桌面端触发系统下载
            window.open(this.href, '_self');
            return;
        }
        return originalClick.call(this);
    }

    // 支持JS动态生成文件导出（Blob、CSV、JSON、文本）
    window.pakeExportFile = function(content, filename, mimeType='text/plain;charset=utf-8'){
        const blob = new Blob([content], {type: mimeType});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 示例：导出CSV
    window.pakeExportCsv = function(csvContent, fileName="data.csv"){
        window.pakeExportFile(csvContent, fileName, 'text/csv;charset=utf-8');
    }
    // 示例：导出JSON
    window.pakeExportJson = function(jsonObj, fileName="data.json"){
        window.pakeExportFile(JSON.stringify(jsonObj,null,2), fileName, 'application/json;charset=utf-8');
    }

    console.log("✅ PakePlus文件导出脚本已加载，支持网页下载、另存为");
})();

}
// PakePlus 文件导出增强脚本（仅适配 Mac 旧内核 macOS10.13+，保留全部导出能力）
(function(){
    // macOS10.13 WebKit 兼容兜底
    if(!window.URL && window.webkitURL){
        window.URL = window.webkitURL;
    }
    if(!window.Blob){
        console.warn("Blob不受支持，文件导出不可用");
        return;
    }

    // 拦截a标签下载，唤起系统保存弹窗
    const originalClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function(){
        if(this.download && this.href){
            const link = document.createElement('a');
            link.href = this.href;
            link.download = this.download;
            window.open(this.href, '_self');
            return;
        }
        return originalClick.call(this);
    }

    // 通用文件导出
    window.pakeExportFile = function(content, filename, mimeType='text/plain;charset=utf-8'){
        try{
            const blob = new Blob([content], {type: mimeType});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // Mac旧系统延迟释放URL，避免导出文件损坏
            setTimeout(()=>{
                URL.revokeObjectURL(url);
            },100);
        }catch(e){
            console.error("导出异常",e);
            alert("导出失败：当前Mac系统版本较低，导出功能受限");
        }
    }

    // 导出CSV
    window.pakeExportCsv = function(csvContent, fileName="data.csv"){
        window.pakeExportFile(csvContent, fileName, 'text/csv;charset=utf-8');
    }
    // 导出JSON
    window.pakeExportJson = function(jsonObj, fileName="data.json"){
        window.pakeExportFile(JSON.stringify(jsonObj,null,2), fileName, 'application/json;charset=utf-8');
    }

    console.log("✅ Mac版导出脚本已加载，兼容macOS10.13及以上");
})();
