import { Redirect } from 'dva/router';
import * as path from '../../../../utils/pathConfig'

export default () => <Redirect to={path.baseRedirect}/>
