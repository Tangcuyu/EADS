export interface IResponse {
  state: string;
  txtContent: string;
  aniTxt: string;
  childComponent?: {
    title: string;
    imgSrc: string;
    componentName: string
  } | null;
}
