export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  width?: number;
  maxWidth?: number;
  align?: "right" | "center";
  onClick?: (...props: any[]) => any;
  format?: (row: any, value: any) => string | any;
}

export interface Data {
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
}
