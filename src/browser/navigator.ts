class Browser {
    constructor(
        public readonly platform: string,
        public readonly device: string,
        public readonly browser: string,
    ) {
    }
}

function getBrowser() {
    const uAgent = navigator.userAgent;

    let platform = "Unknown",
        device = "pc",
        ub = "";

    if (/linux/i.test(uAgent)) {
        platform = "linux";
    } else if (/macintosh|mac os x/i.test(uAgent)) {
        platform = "mac";
    } else if (/windows|win32/i.test(uAgent)) {
        platform = "windows";
    }

    // Next get the name of device
    if (/iPhone/i.test(uAgent)) {
        device = "mobile ios iphone";
    } else if (/iPod/i.test(uAgent)) {
        device = "mobile ios ipod";
    } else if (/iPad/i.test(uAgent)) {
        device = "mobile ios ipad";
    } else if (/Android/i.test(uAgent)) {
        device = "mobile android";
    }

    const opera = /Opera/i.test(uAgent);
    if (/MSIE/i.test(uAgent) && !opera) {
        ub = "MSIE";
    } else if (/Firefox/i.test(uAgent)) {
        ub = "Firefox";
    } else if (/YaBrowser/i.test(uAgent)) {
        ub = "YaBrowser";
    } else if (/Edge/i.test(uAgent)) {
        ub = "Edge";
    } else if (/Chrome/i.test(uAgent)) {
        ub = "Chrome";
    } else if (/Safari/i.test(uAgent)) {
        ub = "Safari";
    } else if (opera) {
        ub = "Opera";
    } else if (/Netscape/i.test(uAgent)) {
        ub = "Netscape";
    } else if (/rv:11/i.test(uAgent)) {
        ub = "ie11";
    }

    return new Browser(platform, device, ub);
}

function userAgentClassNames() {
    const browser = getBrowser();

    return browser.device + " " + browser.platform.toLowerCase() + " " + browser.browser.toLowerCase();
}

export function setUserAgentClassNames(element: HTMLElement) {
    element.className += " " + userAgentClassNames();
}