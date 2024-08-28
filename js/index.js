/**
 * 分析歌词
 * @returns 
 */
function parseLrc(){
    var lines = lrc.split('\n')
    var result = []
    for(var i = 0; i<lines.length; i++){
        var line = lines[i]
        var parts = line.split(']')
        var timeParam = parts[0].substring(1)
       // console.log(parts[1])
        var time = parseTime(timeParam)
       // console.log(time)
        var obj = {
            time: time,
            lyric: parts[1]
        }
        result.push(obj)
    }
    return result
}

function parseTime(tm){
    var parts = tm.split(':')
    return +parts[0] * 60 + +parts[1]
}

var lrcData = parseLrc()

var dom = {
    audio : document.querySelector('audio'),
    ul: document.querySelector('.lrc-list'),
    container: document.querySelector('.container'),
}

/**
 * 根据当前时间输出第几句歌词
 * 没有歌词显示：-1
 * @returns 
 */
function findIndex(){
    var curr = dom.audio.currentTime
    //console.log(curr)
    for(var i = 0; i<lrcData.length; i++){
        //console.log(lrcData[i].time)
        if(lrcData[i].time > curr){
            return  i-1;
        }
    }
    return lrcData.length -1;
}

function createLRCElement(){
    var frag = document.createDocumentFragment()
    for(var i = 0; i < lrcData.length; i++){
        // 提高效率
        var word = lrcData[i].lyric
        var li = document.createElement('li')
        li.textContent = word
        frag.appendChild(li) 
    }
    dom.ul.appendChild(frag) // change dom tree only once
}

createLRCElement()

var containerHeight = dom.container.clientHeight
var liHeight = dom.ul.children[0].clientHeight
var maxOffset = dom.ul.clientHeight - containerHeight

function setOffSet(){
    var index = findIndex()
    var ulHeight = index * liHeight + liHeight/2
    var offSet = ulHeight - containerHeight/2
    if(offSet<0){
        offSet = 0
    }
    if(offSet > maxOffset){
        offSet = maxOffset
    }
   // console.log(dom.ul)
    dom.ul.style.transform = `translateY(-${offSet}px)`
   // console.log(offSet)
    // remove style 
    var prev = dom.ul.querySelector('.active')
    if(prev){
        prev.classList.remove('active')
    }
    var li = dom.ul.children[index]
    if(li){
       li.classList.add('active')
    }
}

dom.audio.addEventListener('timeupdate', setOffSet)