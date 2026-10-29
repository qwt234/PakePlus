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
{{
  "tauri": {
    "bundle": {
      "macOS": {
        "plist": {
          "NSCameraUsageDescription": "应用需要摄像头权限，用于扫码、拍照",
          "NSMicrophoneUsageDescription": "应用需要麦克风权限，用于语音录制",
          "NSPhotoLibraryUsageDescription": "应用需要访问相册，用于选择图片文件",
          "NSLocationWhenInUseUsageDescription": "应用需要定位权限，用于签到打卡",
          "UIBackgroundModes": ["audio"],
          "telephony": true
        }
      },
      "windows": {
        "webviewInstallMode": {
          "type": "embedBootstrapper"
        },
        "minimumWebview2Version": "110.0.1531.0",
        "nsis": {
          "installMode": "currentUser",
          "languages": ["SimpChinese"]
        },
        "wix": {
          "language": "zh-CN"
        }
      }
    }
  }
}
