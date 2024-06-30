import { GenericResponse } from '../models';

export function centerScroll(elementId = 'mainContainer') {
  const element = document.getElementById(elementId);
  element?.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'center',
  });
}

export const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

export function isGenericResponse(obj: any): obj is GenericResponse<any> {
  return 'message' in obj || 'data' in obj || 'error' in obj;
}

export function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(',');
  if (arr && arr[0]) {
    const res = arr[0].match(/:(.*?);/);
    const mime = res ? res[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  return null;
}
