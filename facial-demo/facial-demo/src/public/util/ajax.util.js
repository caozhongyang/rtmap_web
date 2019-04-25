import { HEADER_KEYS,CACHE_KEYS } from '@/public/constant';


const saveToken = (response) => {
    if (response.headers[HEADER_KEYS.X_SESSION_TOKEN]) {
      var token = response.headers[HEADER_KEYS.X_SESSION_TOKEN];
      m2.cache.set(CACHE_KEYS.SESSION_TOKEN, token);
    }
};
const handleDate = (response) => {
    if (typeof response.data == 'string') {
        var JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/;
        var APPLICATION_JSON = 'application/json';
        var JSON_START = /^\[|^\{(?!\{)/;
        var JSON_ENDS = {
            '[': /]$/,
            '{': /}$/
        };

        var tempData = response.data.replace(JSON_PROTECTION_PREFIX, '').trim();
        if (tempData) {
            var contentType = response.headers['content-type'];
            var jsonStart = tempData.match(JSON_START);
            if ((contentType && (contentType.indexOf(APPLICATION_JSON) === 0)) || jsonStart && JSON_ENDS[jsonStart[0]].test(tempData)) {
                response.data = (new Function("", "return " + tempData))();
            }
        }
    }
};


export default {
    getRequestHeaders: (props) => {
        var token = m2.cache.get(CACHE_KEYS.SESSION_TOKEN);
        return {
            'Content-Type': HEADER_KEYS.CONTENT_JSON_TYPE,
            'Access-Control-Allow-Origin':'*',
             'Authorization' : sessionStorage.getItem('token'),
            // [HEADER_KEYS.X_SESSION_TOKEN]: token,
            ...token,
            ...props
        }
    },
    getRequestConfig: (config,props) => {
        if(!config.isFormData){
            config.headers = app.util.ajax.getRequestHeaders(props);
        }
        
        return config;
    },
    parseResponseData: (response) => {
        handleDate(response);
        saveToken(response);
    }
};
