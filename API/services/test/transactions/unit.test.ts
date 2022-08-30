import { expect } from 'chai';
import { container } from 'tsyringe';
import Locks from '../../transactions/locks/locks';

async function pause() {
  await new Promise(resolve => setTimeout(resolve, 100));
}

const userEmail1 = "test1@test.com";

describe('locking', function () {
  it('should lock without exception', function () {

    let lockId = Locks.getLock(userEmail1)
    expect(lockId).to.be.a.string
    pause()
    Locks.releaseLock(userEmail1, lockId)
    lockId = Locks.getLock(userEmail1)
    expect(lockId).to.be.a.string
    pause()
    Locks.releaseLock(userEmail1, lockId)

  });

  it('should lock with exception then continue processing', function () {

    let lockId = Locks.getLock(userEmail1)
    try{ Locks.getLock(userEmail1)
    } catch (err:any){
      expect(err.message).to.eql(`test1@test.com: lock not available, lock id: ${lockId}`);
    }
    //expect(Locks.getLock(userEmail1)).to.throw(`Error: test1@test.com: lock not available, lock id: ${lockId}`)
    Locks.releaseLock(userEmail1, lockId)

    lockId = Locks.getLock(userEmail1)
    expect(lockId).to.be.a.string
    pause()
    Locks.releaseLock(userEmail1, lockId)

  });
});
