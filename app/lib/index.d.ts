/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export declare class Database {
  constructor(path: string)
  close(): void
  query(sql: string, params: Array<string>): Array<Record<string, any>>
  execute(sql: string, params: Array<string>): boolean
}
