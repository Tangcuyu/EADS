import io from 'socket.io-client';

const path: string = 'http://localhost:3000';
const VueScoketConnect = io(path);


export default VueScoketConnect;
