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
// PakePlus 文件导出脚本，仅适配 macOS 10.13
(function(){
    // macOS10.13 WebKit 兼容垫片
    if (!window.URL && window.webkitURL) {
        window.URL = window.webkitURL;
    }
    if (typeof Blob === undefined) {
        console.warn("Blob不可用，文件导出功能失效");
        return;
    }

    // 拦截a标签下载链接，唤起系统保存弹窗
    const originalClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function(){
        if(this.download && this.href){
            try{
                const a = document.createElement('a');
                a.href = this.href;
                a.download = this.download;
                window.open(this.href, '_self');
                return;
            }catch(e){
                console.error("a标签下载异常",e);
            }
        }
        return originalClick.call(this);
    }

    // 通用文件导出方法
    window.pakeExportFile = function(content, filename, mimeType="text/plain;charset=utf-8"){
        try{
            const blob = new Blob([content], {type:mimeType});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // 延迟释放，修复mac10.13文件损坏
            setTimeout(()=>URL.revokeObjectURL(url),150);
        }catch(err){
            console.error("导出失败",err);
            alert("文件导出失败");
        }
    }

    // 快捷导出CSV
    window.pakeExportCsv = function(csvContent, fileName="data.csv"){
        window.pakeExportFile(csvContent, fileName, "text/csv;charset=utf-8");
    }
    // 快捷导出JSON
    window.pakeExportJson = function(jsonObj, fileName="data.json"){
        window.pakeExportFile(JSON.stringify(jsonObj,null,2), fileName, "application/json;charset=utf-8");
    }

    console.log("✅ 导出脚本已加载，适配macOS10.13");
})();
