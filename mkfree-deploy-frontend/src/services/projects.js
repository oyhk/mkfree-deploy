import {request, requestResult} from "../utils/request";
import {stringify} from "qs";
export function fetch({pageNo = 0}) {
    return request(`/api/project/page?pageNo=${pageNo}&pageSize=20`);
}

export function save(values) {
    return request('/api/project/save', {
        method: 'POST',
        body: JSON.stringify(values),
    });
}

export function update(values) {
    return requestResult('/api/project/update', {
        method: 'PUT',
        body: JSON.stringify(values),
    });
}


export function remove(id) {
    return requestResult('/api/project/delete', {
        method: 'DELETE',
        body: JSON.stringify({id: id}),
    });
}

export function deploy(body) {
    return request('/api/project/structure', {
        method: 'POST',
        body: JSON.stringify(body),
    });
}


export function projectFetch({projectsId = 0}) {
    return request(`/api/project/info?id=${projectsId}`);
}

export function seaverFetch({pageNo = 0}) {
    return request(`/api/server_machine/page?pageNo=${pageNo}&pageSize=10000`);
}

export function projectSave(values) {
    return request('/api/project/save', {
        method: 'POST',
        body: JSON.stringify(values),
    });
}

export function projectUpdate(values) {
    return request('/api/project/update', {
        method: 'PUT',
        body: JSON.stringify(values),
    });
}


export function projectRemove(id) {
    return request('/api/project/delete', {
        method: 'DELETE',
        body: JSON.stringify({id: id}),
    });
}

export function projectDeploy(body) {
    return request('/api/project/structure', {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

export function projectStructureLogList(values) {
    return request(`/api/project_structure_log/list?${stringify(values)}`);
}

export function projectStructureLogInfo(values) {
    return request(`/api/project_structure_log/info?${stringify(values)}`);
}


