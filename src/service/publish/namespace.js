import { $cms } from '@jx3box/jx3box-common/js/https'

function getNamespace(params) {
  return $cms().get('/api/cms/namespace/mine', {
    params,
  })
}

function createNamespace(data) {
  return $cms().post('/api/cms/namespace', data)
}

function updateNamespace(id, data) {
  return $cms().put(`/api/cms/namespace/${id}`, data)
}

function getNamespaceById(id) {
  return $cms().get(`/api/cms/namespace/${id}/raw`)
}
function getNamespaceByKey(key) {
  return $cms().get(`/api/cms/namespace/key`, {
    params: {
      key,
    },
  });
}

export { getNamespace, getNamespaceByKey, getNamespaceById, createNamespace, updateNamespace }
