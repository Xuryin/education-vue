import {MessageBox} from 'element-ui'

export const selectMsgDIalog = function (obj,index) {
    setTimeout(function () {
        obj.showMsg = false
        obj.$refs.videoPlayer.player.currentTime(obj.options.answer[index].second)
        obj.$refs.videoPlayer.player.play()
    }, obj.options.answer[index].duration)
}

export const getItem = (item) => {
    return JSON.parse(localStorage.getItem(item))
}

export const setItem = (key, value) => {
    return localStorage.setItem(key, JSON.stringify(value))
}

