import request from '@/utils/request';
export function setUserName(data) {
  return request({
    url: '',
    method: 'post',
    data,
  });
}
