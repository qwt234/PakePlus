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
    "bundle": {
      "macOS": {
        "minimumSystemVersion": "10.14"
      }
    }
  }
}
{
  "tauri": {
    "bundle": {
      "macOS": {
        "plist": {
          "NSCameraUsageDescription": "应用需要摄像头权限，用于扫码、拍照",
          "NSMicrophoneUsageDescription": "应用需要麦克风权限，用于语音录入、音视频通话",
          "NSLocationWhenInUseUsageDescription": "应用需要位置权限，用于位置相关业务",
          "NSAppleMusicUsageDescription": "应用需要后台音频播放权限",
          "NSDocumentsFolderUsageDescription": "应用需要访问文件，用于上传下载文档图片"
        }
      }
    },
    "security": {
      "capabilities": [
        {
          "identifier": "main",
          "permissions": [
            "core:default",
            "webview:allow-webview",
            "fs:allow-all-read",
            "fs:allow-all-write",
            "geolocation:allow",
            "notification:allow",
            "shell:allow-open",
            "shell:allow-make-phone-call"
          ]
        }
      ]
    }
  }
}
(function() {
    // ========== Mac 10.13 白屏修复核心 ==========
    // 旧版WebKit兼容垫片，修复Promise、fetch渲染阻塞导致空白页面
    if (!window.Promise || /AppleWebKit\/605\.1\.15/.test(navigator.userAgent)) {
        // 兼容requestAnimationFrame
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(cb){
                return setTimeout(cb, 16);
            }
        }
        // 修复Blob构造兼容
        const OldBlob = window.Blob;
        window.Blob = function(parts, opts){
            opts = opts || {};
            if(!opts.type) opts.type = '';
            return new OldBlob(parts, opts);
        }
    }

    // 延迟渲染兜底：页面加载异常时重试渲染，解决白屏
    let retryCount = 0;
    function checkBlank() {
        retryCount++;
        const body = document.body;
        if (body && body.innerHTML.trim().length < 100 && retryCount < 6) {
            location.reload();
        }
    }
    setTimeout(checkBlank, 1200);
    setTimeout(checkBlank, 3000);

    // ========== 文件导出功能（适配10.13旧webkit） ==========
    // 拦截a标签下载链接
    const originAnchorClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function() {
        if(this.download && this.href) {
            const tempA = document.createElement('a');
            tempA.href = this.href;
            tempA.download = this.download;
            tempA.style.display = 'none';
            document.body.appendChild(tempA);
            tempA.click();
            tempA.remove();
            return;
        }
        return originAnchorClick.call(this);
    }

    // 全局导出函数，页面可调用：pakeExportFile(内容,文件名,mime)
    window.pakeExportFile = function(content, filename, mimeType="text/plain;charset=utf-8"){
        const blob = new Blob([content], {type: mimeType});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
})();
{
  "tauri": {
    "bundle": {
      "macOS": {
        "minimumSystemVersion": "10.13",
        "languages": ["zh-Hans"]
      }
    }
  }
}
