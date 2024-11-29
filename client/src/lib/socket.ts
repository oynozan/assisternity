import socketIO from 'socket.io-client';

const socket = socketIO(process.env.REACT_APP_BACKEND, {
    withCredentials: true,
});
export default socket;