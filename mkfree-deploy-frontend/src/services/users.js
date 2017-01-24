import request from '../utils/request';

export function fetch({pageNo=0}) {
    return request(`/api/user/page?pageNo=${pageNo}`);
}