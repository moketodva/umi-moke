import React from 'react'
import {Redirect} from 'dva/router';
import util from '@/utils/util'


export default () => <Redirect to={util.route.getRootPath()}/>


