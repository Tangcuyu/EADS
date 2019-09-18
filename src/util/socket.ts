import { Socket, ISocketData } from '../interface/socket';

const path: string = 'ws://10.3.10.35:8080/ws';
const socket = new Socket(path);
socket.onopen();
export default socket;
