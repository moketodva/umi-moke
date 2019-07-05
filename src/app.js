import request from '@/utils/request';
import API from '@/constant/background-api';
import util from '@/utils/util';

export const dva = {
    config: {
        onError(err) {
            err.preventDefault();
            console.error(err.message);
        }
    }
};

let serveRoutes = null;

export function patchRoutes(routes) {
    serveRoutes.forEach(router => {
        routes[1].routes.unshift(router);
    });
}

export function render(oldRender) {
    const wrapper = request(API.router.allForRegister, undefined, true);
    wrapper.then(result => {
        if (!result) {
            return;
        }
        serveRoutes = util.route.parseForRegister(result.data);
        util.route.saveRootPath(serveRoutes[0].path);
        oldRender();
    });
}
