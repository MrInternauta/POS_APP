import { GenericResponse } from '../models';

export function centerScroll(elementId: string = 'mainContainer') {
  let element = document.getElementById(elementId);
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
