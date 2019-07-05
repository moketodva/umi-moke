import { STORE_KEY } from '@/constant/other';
import { Base64 } from 'js-base64';
import jsMd5 from 'js-md5';

let util = {
    store: {
        set: (key, value) => {
            // 若value为undefined或null, 对key进行删除操作
            if (value === undefined || value === null) {
                return this.remove(key);
            }
            // 如果存的是Map（特殊处理，JSON.stringify无法把map转为json）
            if (value instanceof Map) {
                value = util.other.mapToJson(value);
            } else {
                value = JSON.stringify(value);
            }
            localStorage.setItem(key, value);
        },
        get: key => {
            const value = localStorage.getItem(key);
            let val;
            try {
                val = JSON.parse(value);
            } catch (e) {
                // 不是json格式的字符串直接赋原始值
                val = value;
            }
            return val;
        },
        remove: key => {
            localStorage.removeItem(key);
        },
        clear: () => {
            localStorage.clear();
        },
    },
    dict: {
        // 字典数据格式转换
        formatDict: dict => {
            if (dict instanceof Array) {
                const map = new Map();
                dict.forEach(item => {
                    const { type, name, value } = item;
                    let subMap = map.get(type);
                    if (!subMap) {
                        subMap = new Map();
                    }
                    subMap.set(name, value);
                    map.set(type, subMap);
                });
                return map;
            }
        },
        // 保存字典
        save: dict => {
            const dictMap = util.dict.formatDict(dict);
            util.store.set(STORE_KEY.DICT, dictMap);
        },
        // 根据类型查找
        findByType: type => {
            const dictMap = util.store.get(STORE_KEY.DICT);
            if (dictMap === null || !dictMap[type]) return;
            const map = util.other.jsonToMap(dictMap[type]);
            return [...map].map(item => {
                return {
                    value: item[0],
                    text: item[1],
                };
            });
        },
        // 根据Type和Name查找
        findByTypeAndName: (type, name) => {
            const dictMap = util.store.get(STORE_KEY.DICT);
            if (dictMap === null || !dictMap[type]) return;
            const typeMap = JSON.parse(dictMap[type]);
            return typeMap[name];
        }
    },
    auth: {
        save: token => {
            util.store.set(STORE_KEY.TOKEN, token);
        },
        remove: () => {
            util.store.remove(STORE_KEY.TOKEN);
        },
        get: () => {
            return util.store.get(STORE_KEY.TOKEN);
        },
        getRoles: () => {
            const jwt = util.store.get(STORE_KEY.TOKEN);
            const subjectJson = Base64.decode(jwt.split('.')[1]);
            const subject = JSON.parse(subjectJson);
            const sub = JSON.parse(subject.sub);
            return sub.roles;
        },
        getUserId: () => {
            const jwt = util.store.get(STORE_KEY.TOKEN);
            const subjectJson = Base64.decode(jwt.split('.')[1]);
            const subject = JSON.parse(subjectJson);
            const sub = JSON.parse(subject.sub);
            return sub.id;
        }
    },
    route: {
        save: routers => {
            util.store.set(STORE_KEY.ROUTER, routers);
        },
        remove: () => {
            util.store.remove(STORE_KEY.ROUTER);
        },
        saveRootPath: rootPath => {
            util.store.set(STORE_KEY.ROOT_PATH, rootPath);
        },
        removeRootPath: () => {
            util.store.remove(STORE_KEY.ROOT_PATH);
        },
        getRootPath: () => {
            return util.store.get(STORE_KEY.ROOT_PATH);
        },
        parseForRegister: routers => {
            if(!routers || routers.length === 0){
                return [];
            }
            return routers.map(router => {
                const result = {};
                result.path = router.absolutePath;
                if(router.component){
                    try {
                        result.component = require('@/pages/' + router.component ).default;
                    }catch (e) {
                        return;
                    }
                }
                if(router.exact){
                    result.exact = router.exact;
                }
                if(router.permission && router.permission.id){
                    result.Routes = [require('@/components/Authoritied').default];
                    result.permission = router.permission.name;
                }
                if(router.children && router.children.length > 0){
                    const childRouters = util.route.parseForRegister(router.children);
                    result.routes = childRouters;
                }
                return result;
            }).filter(router => router != undefined);
        },
        parseForTree: routers => {
            if (!routers || routers.length === 0) {
                return {};
            }
            const tempCheckedKeys = [];
            const tempOtherCheckedKeys = [];
            const newRouters = routers.map((router) => {
                router.key = router.id;
                router.title = router.name;
                if (router.checked) {
                    tempCheckedKeys.push(router.key);
                }
                if (router.children && router.children.length > 0) {
                    const { dataSource, checkedKeys, otherCheckedKeys } = util.route.parseForTree(router.children);
                    tempCheckedKeys.push(...checkedKeys);
                    tempOtherCheckedKeys.push(...otherCheckedKeys);
                    if(checkedKeys.length > 0){
                        tempOtherCheckedKeys.push(router.key);
                    }
                    router.children = dataSource;
                }
                return router;
            });
            return {
                dataSource: newRouters,
                checkedKeys: tempCheckedKeys,
                otherCheckedKeys: tempOtherCheckedKeys
            };
        }
    },
    permission: {
        save: permission => {
            util.store.set(STORE_KEY.PERMISSION, permission);
        },
        remove: () => {
            util.store.remove(STORE_KEY.PERMISSION);
        },
        get: () => {
            return util.store.get(STORE_KEY.PERMISSION);
        },
        check: permissionName => {
            const permissions = util.permission.get();
            if (!permissions) {
                return false;
            }
            return permissions.findIndex(p => p.name === permissionName) > -1;
        }
    },
    other: {
        // 排序对象格式转换
        sorterFormat: (sorter = {}) => {
            if (sorter.order === undefined || sorter.field === undefined) {
                return sorter;
            }
            const order = sorter.order.substring(0, sorter.order.length - 3);
            let isAsc = true;
            if (!order.startsWith('asc')) {
                isAsc = false;
            }
            return {
                sort: util.string.toLine(sorter.field),
                isAsc,
            };
        },
        jsonToMap: (json) => {
            let obj = JSON.parse(json);
            let map = new Map();
            for (let k of Object.keys(obj)) {
                map.set(k, obj[k]);
            }
            return map;
        },
        mapToJson: (map) => {
            let obj = Object.create(null);
            for (let [k, v] of map) {
                if (v instanceof Map) {
                    v = util.other.mapToJson(v);
                }
                obj[k] = v;
            }
            return JSON.stringify(obj);
        }
    },
    encode: {
        md5: data => {
            let index = 0,
                newStr = '',
                salt = 'abc';
            for (let char of data) {
                if (index % 2 === 1 && index > 3 && index < 9) {
                    newStr += salt;
                }
                newStr += char;
                index++;
            }
            return jsMd5(jsMd5(newStr));
        }
    },
    string: {
        toHump: name => {
            return name.replace(/\_(\w)/g, function(all, letter){
                return letter.toUpperCase();
            });
        },
        toLine: name => {
            return name.replace(/([A-Z])/g,"_$1").toLowerCase();
        }
    }
};

export default util;
