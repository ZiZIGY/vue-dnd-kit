export interface ITableColumn<T = any> {
  label: string;
  key: keyof T;
}
