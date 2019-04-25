export default function (apiConfig) {
    let result = { 
        // cacheKey, headerKey 
    };
    let getProp = (url, length, defaultValue) => {
        if (length > 1) {
            const matches = url.match(/\/api\/(.*)\//);
            if (matches.length > 1) {
                let match = matches[1];
                return match.charAt(0).toLowerCase() + match.substring(1);
            }
        }

        return defaultValue;
    };

    for (let prop in apiConfig) {
        let config = apiConfig[prop];
        let items = [];

        if (m2.type.isArray(config)) {
            items = config;
        }
        if (m2.type.isObject(config)) {
            items = [...items, config];
        }

        let length = items.length;

        items.forEach((item) => {
            let propValue = getProp(item.url, length, prop);

            result[propValue] = {};
            if (item.url && item.actions) {
                for (let action in item.actions) {
                    result[propValue][action] = item.url.format(item.actions[action]);
                }
            }
        });
    }

    return {
        api: result
    };
}