/* WebSocket连接类型描述
 * 接口是描述类的行为的一种方法。也可以说如果类想要实现某种行为的话，接口规定了类必须要实现的一种契约
 */

import { w3cwebsocket } from 'websocket';

export interface ISocket {
  path: string;
  socket: w3cwebsocket;
}

export interface IContent {
  data: string;
  componentName: string;
  layout: string;
  deps: string[];
  uuid: string;
  memo: string;
}

export interface ISocketData {
  content: string;
  messageType: string;
  pushType: string;
  receiverIds: string;
  senderId: string;
}

export class Socket implements ISocket {
  public path: string;
  public socket: w3cwebsocket;
  public handles = {};

  constructor(url: string) {
    this.path = url;
    this.socket = new w3cwebsocket(url);
  }

  public onopen(): void {
    this.socket.onopen();
    console.log(`Connect to websocket: ${this.path}`);
  }
  public onerr(err: any): void {
    this.socket.onerror(err);
  };
  public onmessage(data: string): void {
    console.log(`Connect to websocket: ${data}`);
  };
  public onclose(): void {
    this.socket.close()
    console.log(`Close connection to websocket: ${this.path}`);
  };
  public send(receiverIds: string): void {
    this.socket.send(receiverIds);
    console.log(`Send ${receiverIds} to websocket server`);
  };
}
