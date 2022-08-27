import debug from 'debug';
import shortid from 'shortid';
import { singleton } from 'tsyringe';

const log: debug.IDebugger = debug('app:locks');

@singleton()
class Locks{
  locks: Map<string, string> = new Map()

  getLock =  (userEmail: string) => {
    if (this.locks.has(userEmail)) {
      console.log(`${userEmail}: lock not available`)
      throw new Error(`${userEmail}: lock not available`);
    }
    console.log(`${userEmail}: lock vailable`)
    const lockId = shortid.generate()
    this.locks.set(userEmail, lockId)
    return lockId
  }

  releaseLock = async (userEmail: string, id: string) => {
    if (id === this.locks.get(userEmail)) {
      this.locks.delete(userEmail)
      console.log(`${userEmail}: lock released`)
    } else {
      console.log(`${userEmail}: lock not found`)
      throw new Error(`${userEmail}: lock not found`)
    }
  }
}
export default Locks;

