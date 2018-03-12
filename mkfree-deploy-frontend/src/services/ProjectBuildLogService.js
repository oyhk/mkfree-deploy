import {request, requestData} from '../utils/Request';
import {api} from '../Constant';
import {jsonToUrlParams} from '../utils/Utils';

export async function list(payload, remind) {
    return requestData(`${api.projectBuildLogList.url}?projectId=${payload.projectId}`);
}


export async function info(payload, remind) {
    return requestData(`${api.projectBuildLogInfo.url}?projectId=${payload.projectId}&seqNo=${payload.seqNo}`);
}
