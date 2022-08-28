import debug from 'debug';
import shortid from 'shortid';
import { singleton } from 'tsyringe';

const log: debug.IDebugger = debug('app:locks');

@singleton()
class Locks{
  locks: Map<string, string> = new Map()

  getLock =  (userEmail: string) => {
    if (this.locks.has(userEmail)) {
      log(`${userEmail}: lock not available,lock id: ${this.locks.get(userEmail)}`)
      throw new Error(`${userEmail}: lock not available, lock id: ${this.locks.get(userEmail)}`);
    }
    const lockId = shortid.generate()
    this.locks.set(userEmail, lockId)
    log(`${userEmail}: lock available,lock id: ${this.locks.get(userEmail)}`)
    return lockId
  }

  releaseLock = (userEmail: string, id: string) => {
    if (id === this.locks.get(userEmail)) {
      log(`${userEmail}: lock released,lock id: ${this.locks.get(userEmail)}`)
      this.locks.delete(userEmail)
    } else {
      log(`${userEmail}: lock not found`)
      throw new Error(`${userEmail}: lock not found`)
    }
  }
}
export default new Locks();

