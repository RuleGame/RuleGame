export class WebSocketService {
  private socket: WebSocket | null = null;
  private readonly serverUrl: string;

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.serverUrl = baseUrl;
    } else {
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      const params = new URL(window.location.href).searchParams;
      const server = params.get('server');
      if (server) {
        this.serverUrl = server.replace(/^http/, protocol) + '/websocket/watchPlayer';
      } else {
        throw new Error('Server URL not found in query parameters');
      }
    }
  }

  // Method to handle connection
  connect = (playerId: string) => {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.socket) {
        try {
          this.socket = new WebSocket(this.serverUrl);

          this.socket.onopen = () => {
            this.sendMessage('IAM ' + playerId);
            resolve(true);
          };

          this.socket.onclose = (event) => {
            this.socket = null;
          };

          this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            reject(new Error('WebSocket connection failed'));
          };
        } catch (error) {
          reject(new Error('WebSocket is not supported by this browser'));
        }
      } else {
        resolve(true);
      }
    });
  };

  getSocket = () => {
    return this.socket;
  };

  waitForMessage = (message: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      if (this.socket) {
        this.socket.onmessage = (msg: MessageEvent) => {
          const parts = msg.data.split(' ');
          const command = parts[0] + ' ' + parts[1];

          if (command === message) {
            resolve();
          }
        };
      } else {
        reject();
      }
    });
  };

  waitForReadyEpi = () => {
    return this.waitForMessage('READY EPI');
  };

  waitForReadyDis = () => {
    return this.waitForMessage('READY DIS');
  };

  disconnect = () => {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  };

  sendMessage = (message: string) => {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn('Socket is not connected');
    }
  };
}
