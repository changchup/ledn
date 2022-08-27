

const data = { userEmail: 'tst@test.com', amount: 5, type:"send", createdAt: new Date()};

const axios = require('axios');

async function test1() {
  //console.log('start timer');
  await new Promise(resolve => setTimeout(resolve, 100));
  //console.log('after 1 second');
}

async function func() {
  axios.post('http://localhost:3000/transactions', data)
}

const test = async ()=> {
  const array = new Array(100).fill(func)

    let results = await Promise.all([
      //func(),
     // func(),
      
    ])

    await func()
    await test1()
    await func()
    for(const result of results){
      //console.log(result.status)
    }

}

test()
  