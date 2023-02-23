var app = new Vue({
    el: '#app',
    data() {
        return {
            pickerIf: false,
            clickId: 0,
            menuList: [
                {
                    name: '影视组',
                    color: '#05fa05',
                    id: 1,
                },
                {
                    name: '能量组',
                    color: '#fbfb03',
                    id: 2,
                },
            ],
            itemObj: {
                '1': [
                    {
                        name: '大师兄影视',
                        link: 'https://dsxys.pro'
                    },
                    {
                        name: '奇优影院',
                        link: 'http://qiyoudy.vip'
                    },
                    {
                        name: '西瓜影院',
                        link: 'http://www.bgcjyw.com'
                    },
                    {
                        name: '美剧天堂',
                        link: 'https://wap.meijutt.tv'
                    },
                    {
                        name: '爱美剧',
                        link: 'https://m.imeijutv.com/index.html'
                    },
                ],
                '2': [
                    {
                        name: '汤姆',
                        link: 'https://tom622.com'
                    },
                ]
            }
        }
    },
    computed: {
        isWx() {
            return navigator.userAgent.match(/micromessenger/i);
        }
    },
    created() {

    },
    methods: {
        menuClick(id) {
            this.clickId = id;
            this.showPicker();

        },
        menuItemClick(link) {
            window.open(link);
        },
        showPicker() {
            this.pickerIf = true;
        },
        hidePicker() {
            this.pickerIf = false;
            this.clickId = 0;
        },
    }
})