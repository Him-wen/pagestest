import Item from "antd/lib/list/Item";

const obj = {x:1,y:2};
const sty01 = JSON.stringify(obj);
const sty02 = JSON.stringify({x:[10,undefined,function(){},Symbol('')]});

function replacer(key,value){
    if(typeof value === 'string'){
        return undefined;
    }
    return value;
}
const obj1 = {a:'1',b:'2',c:3}
const sty03 = JSON.stringify(obj1,replacer,'');
const sty04 = JSON.stringify(undefined);
const sty05 = JSON.stringify(true);
const sty06 = JSON.stringify(1);
const sty07 = JSON.stringify(Symbol());
const sty08 = JSON.stringify(null);
const sty09 = JSON.stringify('a');
const sty10 = JSON.stringify(NaN);
const sty11 = JSON.stringify(Infinity);


const sty12 = JSON.stringify(function(){});
const sty13 = JSON.stringify([1,2,3]);
const sty14 = JSON.stringify([1,2,{a:'1'}]);

// console.log(sty03);
console.log(sty04);
console.log(sty05);
console.log(sty06);
console.log(sty07);
console.log(sty08);
console.log(sty09);
console.log(sty10);
console.log(sty11);
console.log('引用类型....');
console.log(sty12);
console.log(sty13);
console.log(sty14);

console.log('--------keys键值对测试');
const result = {a:1,b:2};
console.log(Object.keys(result));
Object.keys(result).forEach((item,index)=>{
    
})
console.log('--------keys键值对测试');


//data typeof
console.log('--------------------------------------------------------------------------------');
console.log(typeof  1);//number
console.log(typeof  '1');//string
console.log(typeof  undefined);//undefined
console.log(typeof  true);//boolean
console.log(typeof  Symbol());//symbol
console.log(typeof  null);//例外 object
console.log(typeof  function(){});// object只有这个ok，例外 function
console.log(typeof  []);//object
console.log(typeof  {});//object
console.log('---------------------------------------------------------');

//data instanceof

function myInstanceof(left,right){
    if(typeof left !='object' || left === null)return false;
    const temp = Object.getPrototypeOf(left);
    while(true){
        if(temp === null)return false;
        if(temp === right.prototype)return true;
        temp=Object.getPrototypeOf(temp);
    }
}

const In01 = function(){}

let benz = new In01();

console.log( myInstanceof(benz,In01) );

const a = Object.prototype.toString.call('acwing');
console.log(a);
console.log('强制类型转换---------------------------------------------------------');

console.log(Number(1));
console.log(Boolean(undefined));


console.log('12'==12);
console.log('下面是手写方法------------------------------------------------------------------');


//stringify方法实现

function myStringify(data){
    let type = typeof data;

    if(type !== 'object'){
        if(type =='undefined' || type == 'symbol' || type == 'function'){
            return undefined;
        }else if(type.isNaN(data) || data =='Infinity'){
            return "null";
        }else if(type === 'string') {
            return '"'+data+'"';
        }
        return String(data);
    }
/* 
object类型
1.为空null的情况
2.为数组的情况 undefined/function/symbol返回'null'
3.如果有toJSON方法，那么序列化(stringify)返回值
4.处理普通对象：用Object.keys(data).forEach;key为symbol忽略
*/
    if(type === 'object'){
        if(data == null){
            return "null"
        }else if(data instanceof Array){
            let result = [];
            data.forEach((item,index)=>{
                if(typeof item ==='undefined' || typeof item ==='symbol' || typeof item ==='function'){
                    result[index] = 'null';//这三种是特殊情况
                }else{
                    result[index] = myStringify(item);//剩下的直接递归
                }
            })
            result = "[" + result + "]";
            return result.replace(/'/g,'"');
        }else if(data.toJSON && typeof data.toJSON === 'function'){
            return myStringify(data.toJSON);
        }else {//普通对象
            // ...
            // 处理普通对象
        //  let result = [];
        //  Object.keys(data).forEach((item, index) => {
        //     if (typeof item !== 'symbol') {
        //       //key 如果是 symbol 对象，忽略
        //       if (data[item] !== undefined && typeof data[item] !== 'function' && typeof data[item] !== 'symbol') {
        //         //键值如果是 undefined、function、symbol 为属性值，忽略
        //         result.push('"' + item + '"' + ":" + jsonStringify(data[item]));
        //       }
        //     }
        //  });
        //  return ("{" + result + "}").replace(/'/g, '"');
        }
    }
}


