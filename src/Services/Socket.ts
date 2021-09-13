import {io, Socket} from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { getType, EmptyActionCreator, PayloadAction, Action } from 'typesafe-actions';
import { call, take, put, cancelled, fork, cancel } from 'redux-saga/effects';
import { API_BASE_URL } from 'Utils/constants';
import { User } from 'Interfaces/User';
import StorageService from './Storage';

interface WatcherActionCreators {
  stop: EmptyActionCreator<any>;
  failure: (error:any) => PayloadAction<string, any>;
}

interface SocketEventEmitter {
  (
    event: string,
    dataToEmit:any,
    successActionCreator: (data: any) => Action<any>,
    errorActionCreator: (error:any) => Action<any>,
  ): void;
}

export class SocketService {
  client: Socket | null = null;

  connect = () => {
    if (!this.client) {
      this.client = io(API_BASE_URL, {
        autoConnect: false,
        transports: ['websocket'],
        upgrade: false,
      });
      this.client.open();
    }
  };

  disconnect = () => {
    if (this.client?.connected) {
      this.client.close();
      this.client = null;
    }
  };

  on = (event: string, cb: (data: any) => void) => {
    this.client?.on(event, cb);
  };

  emit = (event: string, data: { userId: string; headers: { authorization: string; }; }, cb: (data: any) => void) => {
    this.client?.emit(event, data, cb);
  };

  private createSocketEventChannel = (event: string, data?: any) =>
    eventChannel(emitter => {
      if (data) {
        this.emit(event, data, emitter);

        return () => {};
      }

      this.on(event, emitter);

      // @ts-ignore
      return () => this.client?.removeEventListener(event);
    });

  private *channelizeSocketEvent(event: string, handlerActionCreator: any):any {
    const socketEventChannel = yield call(this.createSocketEventChannel, event);

    try {
      while (true) {
        const data = yield take(socketEventChannel);

        yield put(handlerActionCreator(data));
      }
    } finally {
      if (yield cancelled()) {
        socketEventChannel.close();
      }
    }
  }

  private *watchSocketEvent<
    THandlerActionCreator,
    TWatcherActionCreators extends WatcherActionCreators
  >(
    event: string,
    handlerActionCreator: THandlerActionCreator,
    watcherActionCreators: TWatcherActionCreators,
  ):any {
    try {
      const channelTask = yield fork(
        this.channelizeSocketEvent.bind(this),
        event,
        handlerActionCreator,
      );

      yield take(getType(watcherActionCreators.stop));

      yield cancel(channelTask);
    } catch (error) {
      yield put(watcherActionCreators.failure(error));
    }
  }

  createSocketEventWatcher = <
    THandlerActionCreator,
    TWatcherActionCreators extends WatcherActionCreators
  >(
    event: string,
    handlerActionCreator: THandlerActionCreator,
    watcherActionCreators: TWatcherActionCreators,
  ) =>
    this.watchSocketEvent.bind(this, event, handlerActionCreator, watcherActionCreators);

  private *emitSocketEvent(...args: Parameters<SocketEventEmitter>):any {
    const [event, dataToEmit, successActionCreator, errorActionCreator] = args;

    const socketEventChannel = yield call(
      this.createSocketEventChannel,
      event,
      dataToEmit,
    );

    try {
      const data = yield take(socketEventChannel);

      yield put(successActionCreator(data));
    } catch (error) {
      yield put(errorActionCreator(error));
    } finally {
      socketEventChannel.close();
    }
  }

  createSocketEventEmitter = (...args: Parameters<SocketEventEmitter>) =>
    this.emitSocketEvent.bind(this, ...args);

  joinRoom = async (userId: User['id']) => {
    const accessToken = await StorageService.getAccessToken();

    return new Promise((resolve, reject) => {
      const errorHandler = (err:any) => {
        this.client?.off('exception', errorHandler);
        this.client?.off('disconnect', errorHandler);
        reject(err);
      };

      this.on('exception', errorHandler);
      this.on('disconnect', errorHandler);
      this.emit(
        'join',
        {
          userId,
          headers: { authorization: `Bearer ${accessToken}` },
        },
        data => {
          this.client?.off('exception', errorHandler);
          this.client?.off('disconnect', errorHandler);
          resolve(data);
        },
      );
    });
  };
}

export default new SocketService();