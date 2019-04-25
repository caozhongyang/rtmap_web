// 浏览器头
export const HEADER_KEYS = {
    X_SESSION_TOKEN: 'x-session-token',
    CONTENT_JSON_TYPE: 'application/json;charset=UTF-8'
};
// 所有的缓存KEY
export const CACHE_KEYS = {
    SESSION_TOKEN: 'rx-session-token',
};

// 时间格式
export const DATE_FORMAT = {
    'en-US': {
    	  dateTimeIos:'yyyy/MM/dd hh:mm',
        dateTime: 'yyyy-MM-dd hh:mm:ss',
        dateTimeShort: 'yyyy-MM-dd hh:mm',
        dateShort: 'yyyy-MM-dd',
        timeShort: 'hh:mm',
        separator: '--'
    },
    'zh-CN': {
        dateTime: 'yyyy年M月d日 hh:mm:ss',
        dateTimeShort: 'yyyy年M月d日 hh:mm',
        dateShort: 'yyyy年M月d日',
        timeShort: 'hh:mm',
        separator: '至'
    }
};
export const AXIOS_TEXT = {
    LOADING: '努力加载中...',
    ERROR_MESSAGE_TITLE: '提示',
    ERROR_MESSAGE: '请联系管理员！'
};
// 分页相关配置
export const sortDirection = {
    ASC: 0,
    DESC: 1
};

export const defaultPageIndex = 20;
export const defaultPageSize = 20;

export const pager = (config) => {
    return {
        pageParams: {
            pageIndex: config.pageIndex || 1,
            pageSize: config.pageSize === undefined ? defaultPageSize : config.pageSize,
            totalCount: config.totalCount || -1
        }
    };
};
export const orderBy = (config) => {
    return {
        orderBy: [{
            dataField: config.dataField || '',
            sortDirection: config.sortDirection || sortDirection.ASC
        }]
    }
};
