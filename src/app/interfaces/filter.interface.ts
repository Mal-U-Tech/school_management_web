
type HttpParamObject = {
  [param: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string | number | boolean>;
};

export interface IFilter extends HttpParamObject {
  page: number;
  size: number;

  search: string;
}

export const DEFAULT_FILTER: IFilter = {
  page: 0,
  size: 25,

  search: '',
};
