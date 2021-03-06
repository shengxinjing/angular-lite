import { register, filter } from '../src/filter'
import { filterFilter as ff } from '../src/filter_filter'
import { publishExternalAPI } from '../src/angular_public'
import { createInjector } from '../src/injector'

describe('filter filter', () => {
  var parse
  beforeEach(function () {
    publishExternalAPI()
    parse = createInjector(['ng']).get('$parse')
  })
  it('可用', () => {
    var injector = createInjector(['ng'])
    expect(injector.has('filterFilter')).toBe(true)
  // expect(ff('filter')).toBeDefined()
  })
  it('可以用函数过滤数组', () => {
    let fn = parse('[1,2,3,4,5] | filter:isOdd')
    let scope = {
      isOdd: n => {
        return n % 2 !== 0
      }
    }
    expect(fn(scope)).toEqual([1, 3, 5])
  })
  it('可以用字符串过滤数组', () => {
    let fn = parse('arr | filter:"a"')
    let scope = {
      arr: ['a', 'b', 'c', 'a']
    }
    expect(fn(scope)).toEqual(['a', 'a'])
  })
  it('可以用字符串模糊过滤数组', () => {
    let fn = parse('arr | filter:"a"')
    let scope = {
      arr: ['a', 'b', 'ca', 'a']
    }
    expect(fn(scope)).toEqual(['a', 'ca', 'a'])
  })
  it('可以用字符串忽略大小写模糊过滤数组', () => {
    let fn = parse('arr | filter:"a"')
    let scope = {
      arr: ['a', 'b', 'cA', 'a']
    }
    expect(fn(scope)).toEqual(['a', 'cA', 'a'])
  })

  it('可以过滤数组', () => {
    let fn = parse('arr | filter:"o"')
    let scope = {
      arr: [{name: 'john',test: 'Brown'},
        {name: 'jane',test: 'Fox'},
        {name: 'Mary',test: 'Quick'}]
    }
    expect(fn(scope)).toEqual([
      {name: 'john',test: 'Brown'},
      {name: 'jane',test: 'Fox'}])
  })

  it('可以过滤嵌套的数组', () => {
    let fn = parse('arr | filter:"o"')
    let scope = {
      arr: [{name: {name: 'john',test: 'Brown'}},
        {name: {name: 'jane',test: 'Fox'}},
        {name: {name: 'Mary',test: 'Quick'}}]
    }
    expect(fn(scope)).toEqual([
      {name: {name: 'john',test: 'Brown'}},
      {name: {name: 'jane',test: 'Fox'}}])
  })

  it('可以过滤长度不一的数组', () => {
    let fn = parse('arr | filter:"o"')
    let scope = {
      arr: [{name: 'john',test: 'Brown'},
        {name: 'jane'}]
    }
    expect(fn(scope)).toEqual([
      {name: 'john',test: 'Brown'}])
  })
  it('用数字过滤', () => {
    let fn = parse('arr | filter:42')
    let scope = {
      arr: [{name: 'john',test: 42},
        {name: 'jane',test: 43},
        {name: 'Mary',test: 44}]
    }
    expect(fn(scope)).toEqual([
      {name: 'john',test: 42}])
  })
  it('用布尔过滤', () => {
    let fn = parse('arr | filter:true')
    let scope = {
      arr: [{name: 'john',test: true},
        {name: 'jane',test: false},
        {name: 'Mary',test: false}]
    }
    expect(fn(scope)).toEqual([
      {name: 'john',test: true}])
  })

  it('用数字模糊过滤字符串', () => {
    let fn = parse('arr | filter:42')
    let scope = {
      arr: [{name: 'john',test: 42},
        {name: 'jane',test: '$42yuan'},
        {name: 'Mary',test: 44}]
    }
    expect(fn(scope)).toEqual([
      {name: 'john',test: 42},
      {name: 'jane',test: '$42yuan'}])
  })

  it('过滤null', () => {
    let fn = parse('arr | filter:null')
    let scope = {
      arr: [null, undefined, 'not null']
    }
    expect(fn(scope)).toEqual([null])
  })

  it('过滤null字符串', () => {
    let fn = parse('arr | filter:"null"')
    let scope = {
      arr: [null, undefined, 'not null']
    }
    expect(fn(scope)).toEqual(['not null'])
  })

  it('不匹配undefined', () => {
    let fn = parse('arr | filter:"undefined"')
    let scope = {
      arr: [null, undefined, 'not undefined']
    }
    expect(fn(scope)).toEqual(['not undefined'])
  })

  it('!开头取反过滤', () => {
    let fn = parse('arr | filter:"!a"')
    let scope = {
      arr: ['cc', 'b', 'ca', 'a']
    }
    expect(fn(scope)).toEqual(['cc', 'b'])
  })

  it('用对象过滤', () => {
    let fn = parse('arr | filter:{name:"o"}')
    let scope = {
      arr: [{name: 'john',test: 'Brown'},
        {name: 'jone',test: 'Fox'},
        {name: 'Mary',test: 'Quick'}]
    }
    expect(fn(scope)).toEqual([
      {name: 'john',test: 'Brown'},
      {name: 'jone',test: 'Fox'}])
  })
  it('用多个key的对象过滤，必须匹配所有的key', () => {
    let fn = parse('arr | filter:{name:"o",test:"n"}')
    let scope = {
      arr: [{name: 'john',test: 'Brown'},
        {name: 'jone',test: 'Fx'},
        {name: 'Mary',test: 'Quick'}]
    }
    expect(fn(scope)).toEqual([
      {name: 'john',test: 'Brown'}])
  })

  it('空对象不过滤', () => {
    let fn = parse('arr | filter:{}')
    let scope = {
      arr: [{name: 'john',test: 'Brown'},
        {name: 'jone',test: 'Fx'},
        {name: 'Mary',test: 'Quick'}]
    }
    expect(fn(scope)).toEqual([
      {name: 'john',test: 'Brown'},
      {name: 'jone',test: 'Fx'},
      {name: 'Mary',test: 'Quick'}])
  })

  it('多层object过滤', () => {
    let fn = parse('arr | filter:{name:{name:"o"}}')
    let scope = {
      arr: [{name: {name: 'john',test: 'Brown'}},
        {name: {name: 'jane',test: 'Fox'}},
        {name: {name: 'Mary',test: 'Quick'}}]
    }
    expect(fn(scope)).toEqual([
      {name: {name: 'john',test: 'Brown'}}])
  })
  it('多层object过滤,可以用!开头取反', () => {
    let fn = parse('arr | filter:{name:{name:"!o"}}')
    let scope = {
      arr: [{name: {name: 'john',test: 'Brown'}},
        {name: {name: 'jane',test: 'Fox'}},
        {name: {name: 'Mary',test: 'Quick'}}]
    }
    expect(fn(scope)).toEqual([
      {name: {name: 'jane',test: 'Fox'}},
      {name: {name: 'Mary',test: 'Quick'}}])
  })

  it('值是undefined的时候不过滤', () => {
    let fn = parse('arr | filter:{name:notDefined}')
    let scope = {
      arr: [{name: 'john',test: 'Brown'},
        {name: 'jone',test: 'Fx'},
        {name: 'Mary',test: 'Quick'}]
    }
    expect(fn(scope)).toEqual([
      {name: 'john',test: 'Brown'},
      {name: 'jone',test: 'Fx'},
      {name: 'Mary',test: 'Quick'}])
  })

  it('多层object过滤,过滤数组', () => {
    let fn = parse('arr | filter:{users:{name:{first:"o"}}}')
    let scope = {
      arr: [
        {
          users: [
            {name: {first: 'john'},role: 'admin'}, {name: {first: 'jane'},role: 'testo'}
          ]
        },
        {users: [{name: {first: 'mary'},role: 'admin'}]}
      ]
    }
    expect(fn(scope)).toEqual([
      {
        users: [{name: {first: 'john'},role: 'admin'},
          {name: {first: 'jane'},role: 'testo'}]
      }
    ])
  })
  it('只在一个level过滤', function () {
    var items = [{user: 'Bob'},
      {user: {name: 'Bob'}},
      {user: {name: {first: 'Bob', last: 'Fox'}}}]
    var fn = parse('arr | filter:{user: {name: "Bob"}}')
    expect(fn({arr: [
        {user: 'Bob'},
        {user: {name: 'Bob'}},
        {user: {name: {first: 'Bob', last: 'Fox'}}}
    ]})).toEqual([
      {user: {name: 'Bob'}}
    ])
  })

  it('key是$表示匹配所有属性', () => {
    let fn = parse('arr | filter:{$:"o"}')
    let scope = {
      arr: [{name: 'jhn',test: 'Brown'},
        {name: 'jone',test: 'Fx'},
        {name: 'Mary',test: 'Quick'}]
    }
    expect(fn(scope)).toEqual([
      {name: 'jhn',test: 'Brown'},
      {name: 'jone',test: 'Fx'}])
  })

  it('过滤复杂层级', function () {
    var fn = parse('arr | filter:{$: "o"}')
    expect(fn({arr: [
        {name: {first: 'Joe'}, role: 'admin'},
        {name: {first: 'Jane'}, role: 'moderator'},
        {name: {first: 'Mary'}, role: 'admin'}
    ]})).toEqual([
      {name: {first: 'Joe'}, role: 'admin'},
      {name: {first: 'Jane'}, role: 'moderator'}
    ])
  })

  it('指定层级', function () {
    var fn = parse('arr | filter:{name: {$: "o"}}')
    expect(fn({arr: [
        {name: {first: 'Joe', last: 'Fox'}, role: 'admin'},
        {name: {first: 'Jane', last: 'Quick'}, role: 'moderator'},
        {name: {first: 'Mary', last: 'Brown'}, role: 'admin'}
    ]})).toEqual([
      {name: {first: 'Joe', last: 'Fox'}, role: 'admin'},
      {name: {first: 'Mary', last: 'Brown'}, role: 'admin'}
    ])
  })

  it('多个$指定多个层级过滤', function () {
    var fn = parse('arr | filter:{$: {$: "o"}}')
    expect(fn({arr: [
        {name: {first: 'Joe'}, role: 'admin'},
        {name: {first: 'Jane'}, role: 'moderator'},
        {name: {first: 'Mary'}, role: 'admin'}
    ]})).toEqual([
      {name: {first: 'Joe'}, role: 'admin'}
    ])
  })
})
