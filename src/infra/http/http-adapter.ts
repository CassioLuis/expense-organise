export default interface HttpAdapter {
  get: (url: any, headers?: any) => Promise<any>
  post: (url: any, data: any) => Promise<any>
  delete: (url: any) => Promise<any>
}
