function getGradeList() {
    let info = JSON.parse(localStorage.getItem("sysInfo"));
    let schoolType = info.schoolType;
    let gradeList = [];
    if (schoolType == "all") {
        gradeList = [
            {
                label: "一年级",
                value: 1
            },
            {
                label: "二年级",
                value: 2
            },
            {
                label: "三年级",
                value: 3
            },
            {
                label: "四年级",
                value: 4
            },
            {
                label: "五年级",
                value: 5
            },
            {
                label: "六年级",
                value: 6
            },
            {
                label: "七年级",
                value: 7
            },
            {
                label: "八年级",
                value: 8
            },
            {
                label: "九年级",
                value: 9
            }
        ];
    }else if(schoolType == 'primary'){
        gradeList = [{
            label: '一年级',
            value: 1
        },
            {
                label: '二年级',
                value: 2
            },
            {
                label: '三年级',
                value: 3
            },
            {
                label: '四年级',
                value: 4
            },
            {
                label: '五年级',
                value: 5
            },
            {
                label: '六年级',
                value: 6
            }
        ]
    }else if(schoolType == 'middle'){
        gradeList = [{
            label: '七年级',
            value: 7
        },
            {
                label: '八年级',
                value: 8
            },
            {
                label: '九年级',
                value: 9
            }
        ]
    }
    return gradeList;
}
export default {
    getGradeList
}
