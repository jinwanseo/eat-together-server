const socket = io('http://localhost:8888', { transports: ['websocket'] }); // 서버주소가 http 프로토콜임을 유의

const message = document.getElementById('message');
const messages = document.getElementById('messages');

const handleSubmitNewMessage = () => {
  socket.emit('order', { data: message.value }); // 클라이언트에서 서버로 이벤트를 발생시킨다
};

// socket.on은 클라이언트단에서 발생한 이벤트를 선택적으로 캐치하여 이벤트 핸들러를 등록함
socket.on('order', ({ data }) => {
  handleNewMessage(data);
});

handleNewMessage = (message) => {
  messages.appendChild(
    buildNewMessage(`${message.pay}원 ${message.location} ${message.limit}`),
  );
};

const buildNewMessage = (message) => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(message));
  return li;
};
