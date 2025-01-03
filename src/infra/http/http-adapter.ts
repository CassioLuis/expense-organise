export default interface HttpAdapter {
  get: (url: any, headers?: any) => Promise<any>
  post: (url: any, body: any) => Promise<any>
  delete: (url: any) => Promise<any>
  patch: (url: any, body: any) => Promise<any>
}
