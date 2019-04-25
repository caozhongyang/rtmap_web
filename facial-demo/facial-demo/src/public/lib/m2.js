(function(global, name, factory) {
	'use strict';

	if(typeof exports === 'object' && typeof module !== 'undefined') {
		module.exports = factory();
	} else if(typeof define === 'function' && (define.amd || define.cmd)) {
		define(factory);
	} else {
		global[name] = factory.apply(this);
	}
}(this, 'm2', function() {
	var VERSION = '1.1.0';
	var m2 = window.m2 = (function(m2) {
		'use strict';

		/**
		 * 私有方法
		 * @private
		 */
		var _ = {
			/**
			 * 判断数据类型
			 * @param type 类型(String, Number, Array, Object, Function)
			 * @param primitive 是否为基本数据类型(string, number, boolean)
			 * @returns {Function}
			 */
			is: function(type, primitive) {
				if(primitive == undefined) primitive = false;
				return function(obj) {
					return primitive ? typeof obj == type.toLowerCase() : {}.toString.call(obj) == "[object " + type + "]";
				};
			},
			cache: {
				current: function(cacheType) {
					return cacheType == 'local' ? localStorage : sessionStorage;
				}
			}
		};

		m2.enums = m2.enums || {};
		m2.type = m2.type || {};
		m2.date = m2.date || {};
		m2.date.utc = m2.date.utc || {};
		m2.util = m2.util || {};
		m2.cache = m2.cache || {};

		/**
		 * 枚举
		 * @param m2.enums
		 * @returns {Object}
		 */
		m2.enums = {
			cacheType: {
				local: 'local',
				session: 'session'
			}
		};

		/**
		 * 数据类型
		 * @param m2.type
		 * @returns {Object}
		 */
		m2.type = {
			isArray: Array.isArray || _.is('Array'),
			isObject: _.is('Object'),
			isFunction: _.is('Function'),
			isString: _.is('String', true),
			isNumber: _.is('Number', true),
			isBoolean: _.is('Boolean', true),
			isJQuery: function(obj) {
				return(obj instanceof jQuery) && jQuery(obj).length;
			},
			/**
			 * 将数据转化为布尔类型，如果设置默认值defaultVal，则当目标对象(一般为undefined)转化不成功时返回默认值
			 * @param target 要转化的目标
			 * @param defaultVal 默认值
			 * @returns {Function}
			 */
			toBoolean: function(target, defaultVal) {
				if(target == undefined) return defaultVal != undefined ? defaultVal : false;
				if(target == 'undefined' || target == null || target == 0 || target == '0' || target == false) return false;
				if(m2.type.isString(target)) return target.toLowerCase() == 'true';

				return !!target;
			}
		};

		/**
		 * 日期类型
		 * @param m2.date
		 * @returns {Object}
		 */
		m2.date = {
			// 当前日
			nowDay: function() {
				return new Date().getDate();
			},
			// 当前月
			nowMonth: function() {
				return new Date().getMonth();
			},
			// 当前年
			nowYear: function() {
				return new Date().getFullYear();
			},
			// 当前日期
			now: function() {
				return new Date();
			},
			// 判断是否为日期
			is: function(value) {
				var date = value;
				var result = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);

				if(result == null) return false;
				var d = new Date(result[1], result[3] - 1, result[4]);
				return(d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4]);
			},
			toUTC: function(date) {
				return date.toISOString();
			},
			// 第一天
			firstDay: function(part, date) {
				if(!date)
					date = new Date();
				switch(part) {
					case 'm':
					case 'month':
					default:
						return m2.date.normalize(new Date(date.getFullYear(), date.getMonth(), 1));
				}
			},
			// 最后一天
			endDay: function(part, date) {
				if(!date)
					date = new Date();
				switch(part) {
					case 'm':
					case 'month':
					default:
						return m2.date.normalize(new Date(date.getFullYear(), date.getMonth(), m2.date.getMonthDays(date.getMonth())));
				}
			},
			// 添加天数
			addDays: function(date, offset) {
				return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
			},
			//规范化日期/时间，日期将被格式化yyyy-MM-dd 00:00:00.000, 时间将被格式化为 yyyy-MM-dd HH:mm:00.000
			normalize: function(date, forTime) {
				if(forTime) {
					return this.formatDatetime(date);
				} else {
					return this.formatDate(date);
				}
			},
			formatDate: function(date) {
				var selectionTime = new Date((date && date.replace && date.replace(/-/g, "/")) || date || Date.now());
				var ticks = selectionTime.getTime();
				var times = selectionTime.getHours() * 60 * 60 * 1000 + selectionTime.getMinutes() * 60 * 1000 + selectionTime.getSeconds() * 1000 + selectionTime.getMilliseconds();

				return new Date(ticks - times);
			},
			//获取格式化后时间点（将秒和毫秒格式化为0）
			formatDatetime: function(date) {
				var selectionTime = new Date((date && date.replace && date.replace(/-/g, "/")) || date || Date.now());
				var ticks = selectionTime.getTime();
				var times = selectionTime.getSeconds() * 1000 + selectionTime.getMilliseconds();

				return new Date(ticks - times);
			},
			getMonthDays: function(month) {
				var monthStartDate = new Date(m2.date.nowYear(), month, 1);
				var monthEndDate = new Date(m2.date.nowYear(), month + 1, 1);
				var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
				return days;
			},
			// 今天
			today: function() {
				return this.normalize(new Date(new Date().setDate(new Date().getDate())));
			},
			isEqual: function(firstDay, secondDay) {
				return firstDay.getTime() == secondDay.getTime();
			},
			isOneMonth: function(firstDay, secondDay) {
				return firstDay.getFullYear() == secondDay.getFullYear() && firstDay.getMonth() == secondDay.getMonth();
			},
			isMonthDay: function(dateToday) {
				return new Date(dateToday).getFullYear() == new Date().getFullYear() && new Date(dateToday).getMonth() == new Date().getMonth();
			},
			isOneToday: function(firstDay, secondDay) {
				return firstDay.getFullYear() == secondDay.getFullYear() && firstDay.getMonth() == secondDay.getMonth() && firstDay.getDate() == secondDay.getDate();
			},
			isTime: function(firstDay, secondDay) {
				return firstDay.getTime() === secondDay.getTime();
			},
			isBigTime: function(firstDay, secondDay) {
				return secondDay.getTime() > firstDay.getTime();
			},
			timeDuration: function(firstDay, secondDay) {
				console.log(secondDay.getHours());
				console.log(firstDay.getHours())
				return(secondDay.getHours() - firstDay.getHours()) + "时" + (secondDay.getMinutes() - firstDay.getMinutes()) + '分';
			},
			getToday: function() {
				return new Date().getDay() + 1;
			},
			isToday(currentDate) {
				var nowYear = new Date().getFullYear();
				var nowMonth = new Date().getMonth();
				var nowDay = new Date().getDay();

				var currentYear = new Date(currentDate).getFullYear();
				var currentMonth = new Date(currentDate).getMonth();
				var currentDay = new Date(currentDate).getDay();
				if(nowYear == currentYear && nowMonth == currentMonth && nowDay == currentDay) {
					return true;
				} else {
					return false;
				}

			},
			isSureCourse(startTime, endTime) {
				return Date.parse(startTime) - 10 * 60 * 1000 < Date.parse(new Date()) && Date.parse(new Date()) < Date.parse(endTime) + 10 * 60 * 1000;
			}
		};

		/**
		 * utc 时间类型
		 * @type {{now: string, today: (*), firstDay: firstDay, addDays: addDays}}
		 */
		m2.date.utc = {
			// 当前日期
			now: new Date().toISOString(),
			// 今天
			today: m2.date.normalize(new Date(new Date().setDate(new Date().getDate()))).toISOString(),
			// 第一天
			firstDay: function(part) {
				switch(part) {
					case 'm':
					case 'month':
					default:
						return m2.date.normalize(new Date(new Date().setDate(1))).toISOString();
				}
			},
			// 最后一天
			endDay: function(part) {
				switch(part) {
					case 'm':
					case 'month':
					default:
						return m2.date.normalize(new Date(m2.date.nowYear(), m2.date.nowMonth(), m2.date.getMonthDays(m2.date.nowMonth()))).toISOString();
				}
			},
			// 添加天数
			addDays: function(date, offset) {
				return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset).toISOString();
			}
		};

		m2.util = {
			getValue: function(items, key) {
				if(key == undefined) return '';
				if(!items || !items.length) return key;
				for(var i = 0, len = items.length; i < len; i++) {
					var item = items[i];
					if(item.key == key) {
						return item.value;
					}
				}
				return '';
			},
			getPermionLoad: function(currenFun) {
				if(currenFun == '') return true;;
				var functions = m2.cache.get('ppts-current-job') ? m2.cache.get('ppts-current-job').functions : [];
				var res = functions.some((item => {
					return item == currenFun;
				}))
				return res;
			},
			getDevice: function() {
				return {
					deviceType: (function() {
						if(window.plus) {
							if(plus.os.name == 'Android' && plus.device.uuid) {
								return 1;
							} else if(plus.os.name == 'iOS' && plus.device.uuid) {
								return 2;
							}else{
								return 3;
							}
						} else {
							return 3;
						}

					})(),
					deviceInfo: (function() {
						if(window.plus) {
							return plus.device.uuid;
						} else {
							return '';
						}
					})(),
					deviceToken: (function() {
						if(window.plus) {
							var ua = navigator.userAgent;
							if(plus.os.name == 'Android') {
								return '';
							} else if(plus.os.name == 'iOS') {
								return plus.push.getClientInfo().token;
							}
						} else {
							return '';
						};
					})()
				};
			}
		};

		/**
		 * 缓存
		 * @param m2.cache
		 * @returns {Object}
		 */
		m2.cache = {
			type: m2.enums.cacheType.local, // 'm2.enums.cacheType.session'
			get: function(key) {
				try {
					return JSON.parse(_.cache.current(m2.cache.type)[key]);
				} catch(e) {
					return _.cache.current(m2.cache.type).getItem(key);
				}
			},
			set: function(key, value) {
				if(m2.type.isObject(value) || m2.type.isArray(value)) {
					_.cache.current(m2.cache.type)[key] = JSON.stringify(value);
				} else {
					_.cache.current(m2.cache.type).setItem(key, value);
				}
			},
			remove: function(key) {
				_.cache.current(m2.cache.type).removeItem(key);
			},
			clear: function() {
				_.cache.current(m2.cache.type).clear();
			}
		};

		return m2;
	})({});

	// 字符串格式化
	String.prototype.format = function(args) {
		var result = this;
		if(arguments.length > 0) {
			if(arguments.length == 1 && typeof(args) == "object") {
				for(var key in args) {
					if(args[key] != undefined) {
						var reg = new RegExp("({" + key + "})", "g");
						result = result.replace(reg, args[key]);
					}
				}
			} else {
				for(var i = 0; i < arguments.length; i++) {
					if(arguments[i] != undefined) {
						var reg = new RegExp("({)" + i + "(})", "g");
						result = result.replace(reg, arguments[i]);
					}
				}
			}
		};

		return result;
	};

	Date.prototype.format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if(/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for(var k in o) {
			if(new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}

		return fmt;
	};

	return m2;
}));