import test from 'ava'
import autoBind from '../../autoBind'

test('autoBind works', t => {
  class MyClass {
    returnThis() {
      return this || 0
    }
    setState(){}
  }

  var obj = new MyClass()

  var unbound = obj.returnThis
  var bound = autoBind(obj).returnThis

  t.is(
    unbound(),
    0,
    'unbound'
  )

  t.true(
    bound() === obj,
    'bound'
  )

})

test('autoBind filter works', t => {
  class MyClass {
    constructor() {
      this.name = 'myclass'
    }
    returnThis() {
      return this || 0
    }
    notBound() {
      return this || 1
    }
    setState(){}
  }

  var obj = new MyClass()

  var unbound = autoBind(obj, { notBound: true }).notBound

  t.is(
    unbound(),
    1,
    'unbound'
  )

  var boundObj = autoBind(obj, function(name){
    return name !== 'notBound'
  })


  const returnThisBound = boundObj.returnThis
  const notBound = boundObj.notBound
  
  t.is(
    returnThisBound(),
    boundObj,
    'returnThisBound'
  )

  t.is(
    notBound(),
    1,
    'notBound'
  )

})