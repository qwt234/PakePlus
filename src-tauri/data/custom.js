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
// PakePlus 文件导出增强脚本 | 兼容 Win7 + macOS 10.13+
// 同时兼容旧WebKit / IE旧内核Blob兼容修复，巴彦淖尔校园食品安全平台使用
(function(){
    // ========== 旧系统内核兼容垫片 ==========
    // Mac 10.13 Safari 使用 webkitURL 兼容
    if (!window.URL && window.webkitURL) {
        window.URL = window.webkitURL;
    }
    // 兼容旧浏览器Blob构造
    if (typeof Blob === 'undefined') {
        console.warn("❌ 当前环境不支持Blob，文件导出功能不可用");
        return;
    }

    // ========== 拦截页面原生a标签下载（修复Pake桌面端保存弹窗失效） ==========
    const originalAClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function() {
        // 判断下载属性
        if (this.download && (this.href || this.href !== '')) {
            try {
                const tempLink = document.createElement('a');
                tempLink.href = this.href;
                tempLink.download = this.download;
                // 唤起下载
                window.open(this.href, '_self');
                return;
            } catch(e) {
                console.error("a标签下载捕获异常", e);
            }
        }
        return originalAClick.call(this);
    };

    // ========== 全局导出函数：通用文件导出 ==========
    window.pakeExportFile = function(content, filename, mimeType = 'text/plain;charset=utf-8') {
        try {
            const blob = new Blob([content], { type: mimeType });
            const objUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = objUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // 延时释放blob地址，修复Mac10.13 / Win7下文件损坏、空白问题
            setTimeout(() => {
                URL.revokeObjectURL(objUrl);
            }, 150);
        } catch (err) {
            console.error("文件导出失败", err);
            alert("导出失败：当前系统版本较低，导出功能受限");
        }
    };

    // ========== 快捷导出封装 ==========
    // 导出CSV
    window.pakeExportCsv = function(csvContent, fileName = "data.csv") {
        window.pakeExportFile(csvContent, fileName, 'text/csv;charset=utf-8');
    };
    // 导出JSON
    window.pakeExportJson = function(jsonObj, fileName = "data.json") {
        window.pakeExportFile(JSON.stringify(jsonObj, null, 2), fileName, 'application/json;charset=utf-8');
    };
    // 导出纯文本
    window.pakeExportText = function(text, fileName = "data.txt") {
        window.pakeExportFile(text, fileName, 'text/plain;charset=utf-8');
    };

    console.log("✅ PakePlus导出脚本加载成功 | 兼容Win7 & macOS10.13");
})();
