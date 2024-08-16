const {
    Database
} = require('../lib/index');

const path = 'D:/temp/data.db'

// 删除文件
const fs = require('fs');
if (fs.existsSync(path)) {
    fs.rmSync(path)
}


// 创建数据库
const db = new Database(path)

const rt = db.execute(`create table "bookmark"
(
    "id"     integer not null primary key autoincrement,
    "parent" integer,
    "sort"   integer,
    "type"   text,
    "url"    text,
    "name"   text,
    "icon"   text,
    "date"   text
)`, [])

if (rt) {
    console.log('create table bookmark success')
}


// 插入数据
const rt2 = db.execute(`insert into bookmark (parent,sort,type,url,name,icon,date) values (?,?,?,?,?,?,?)`,
    ['0', '0', 'folder', 'https://www.baidu.com', '百度', 'https://www.baidu.com/favicon.ico', '2020-01-01'])

if (rt2) {
    console.log('insert into bookmark success')
}


const rt3 = db.execute(`insert into bookmark (parent,sort,type,url,name,icon,date) values (?,?,?,?,?,?,?)`,
    ['0', '1', 'folder', 'https://www.google.com', '谷歌', 'https://www.google.com/favicon.ico', '2020-01-01'])

if (rt3) {
    console.log('insert into bookmark success')
}


// 查询数据
const data = db.query(`select * from bookmark`, [])
console.log(data)