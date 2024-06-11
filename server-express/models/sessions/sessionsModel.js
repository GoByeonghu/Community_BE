// sessionModels
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class SessionModel extends EventEmitter {
  constructor(filePath) {
    super();
    this.filePath = filePath;
    this.sessions = {};

    // 파일이 존재하면 세션 데이터를 로드
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, 'utf8');
      try {
        this.sessions = JSON.parse(data);
      } catch (err) {
        console.error('Failed to parse session data:', err);
        this.sessions = {};
      }
    }
  }

  // 세션 저장
  set(sid, session, callback) {
    this.sessions[sid] = session;
    this.saveSessions(callback);
  }

  // 세션 조회
  get(sid, callback) {
    const session = this.sessions[sid];
    callback(null, session);
  }

  // 세션 삭제
  destroy(sid, callback) {
    delete this.sessions[sid];
    this.saveSessions(callback);
  }

  createSession(req, session) {
    req.session = session;
  }

  // 세션 갱신 (예: 갱신 시간을 업데이트하는 방식으로 구현)
  touch(sid, session, callback) {
    const currentSession = this.sessions[sid];
    if (currentSession) {
      currentSession.cookie = session.cookie; // Update cookie properties if needed
      currentSession.lastAccessTime = new Date(); // 갱신 시간 업데이트
      this.sessions[sid] = currentSession;
      this.saveSessions(callback);
    } else {
      callback(new Error('Session not found'));
    }
  }

  // 세션 데이터를 파일에 저장
  saveSessions(callback) {
    const data = JSON.stringify(this.sessions, null, 2);
    fs.writeFile(this.filePath, data, (err) => {
      if (err) {
        this.emit('disconnect'); // disconnect 이벤트 발생
        return callback(err);
      }
      this.emit('connect'); // connect 이벤트 발생
      callback(null);
    });
  }
}

module.exports = SessionModel;
