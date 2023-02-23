var app = new Vue({
    el: '#app',
    data() {
        return {
            filter: [],
            formation: [],
            levelIndex: '',
            originIndex: '',
            sortIndex: '',
            searchWord: '',

            page: 1,
            pagesum: 0,
            pageNumber: '',

            loadingIf: false,
            popIf: false,
            popDesc: '',
            copyUrl: '',
            popTitle: '温馨提示',
            cancelText: '取消',
            confirmText: '确定',

            isInToPaintedEggshell: false,
        }
    },
    created() {
        this.getFilter();
        this.init();
    },
    methods: {
        getData({ name = this.searchWord, act = 'zhen', lxid = this.levelIndex, fu = this.originIndex, px = this.sortIndex, page = this.page, } = {}) {
            return new Promise((resolve, reject) => {
                // const ip_address = 'http://r9qw9s.natappfree.cc';
                // const ip_address = 'http://localhost:8080';
                axios.get(`/hycoc.aspx?act=${act}&lxid=${lxid}&px=${px}&name=${name}&page=${page}&fu=${fu}`)
                    .then(res => resolve(res.data)).catch(err => reject(err));
            });

        },
        getFilter() {
            this.getData({ act: 'lx' }).then(res => {
                this.filter.push(
                    { name: '基地：', type: 1, level: [{ lxname: '不限', lxid: '' }].concat(res) },
                    { name: '区服：', type: 2, level: [{ lxname: '不限', lxid: '' }, { lxname: '国服', lxid: 1 }, { lxname: '国际服', lxid: 2 }] },
                    { name: '排序：', type: 3, level: [{ lxname: '最新', lxid: '' }, { lxname: '热门', lxid: 2 }] },
                );
            }).catch(err => err);
            // axios.get('http://localhost:8080/hycoc.aspx?act=lx&lxid=69&px=')
        },
        init(obj = {}) {
            this.loadingIf = true;
            this.getData(obj).then(res => {
                this.loadingIf = false;
                this.formation = res;
                this.pageNumber = '';
                if (this.formation.length) {
                    this.pagesum = this.formation[0].pagesum;
                } else {
                    this.pagesum = 0;
                }
            }).catch(err => this.loadingIf = false);
        },
        filterClickEvent(it, type) {
            console.log(it, type);
            switch (type) {
                case 1:
                    // if (this.levelIndex === it.lxid) return;
                    this.levelIndex = it.lxid;
                    this.page = 1;
                    this.init({ lxid: this.levelIndex });
                    break;
                case 2:
                    console.log(this.originIndex)
                    if (this.originIndex === it.lxid) return;
                    this.originIndex = it.lxid;
                    this.page = 1;
                    this.init({ fu: this.originIndex });
                    break;
                case 3:
                    // if (this.sortIndex === it.lxid) return;
                    this.sortIndex = it.lxid;
                    this.page = 1;
                    this.init({ px: this.sortIndex });
                    break;
                default:
                    break;
            }
        },
        searchClickEvent() {
            this.page = 1;
            this.searchWord && this.init();
        },
        resetEvent() {
            this.levelIndex = '';
            this.originIndex = '';
            this.sortIndex = '';
            this.searchWord = '';

            this.page = 1;
            this.pagesum = 0;
            this.pageNumber = '';
            this.init();
        },
        getSum() {
            const date = new Date() // 获取时间
            const year = date.getFullYear() // 获取年
            let month = date.getMonth() + 1 // 获取月
            month = month < 10 ? `0${month}` : month;
            let strDate = date.getDate() // 获取日
            strDate = strDate < 10 ? `0${strDate}` : strDate;
            return Number(String(year) + String(month) + String(strDate));
        },
        chagePage(type) {
            switch (type) {
                case 1:
                    if (this.page <= 1) return;
                    this.page -= 1;
                    this.init();
                    break;
                case 2:
                    if (this.page >= this.pagesum) return;
                    this.page += 1;
                    this.init();
                    break;
                case 3:
                    console.log(this.pagesum, this.pageNumber)
                    if (this.pageNumber > 0 && this.pageNumber <= this.pagesum) {
                        this.pageNumber = parseFloat(this.pageNumber);
                        this.page = this.pageNumber;
                        this.init();
                    } else {
                        if (this.pageNumber === this.getSum()) {
                            this.inToPaintedEggshell();
                        } else {
                            alert('你输入的页码超出范围，请重新输入！');
                        }
                        this.pageNumber = '';
                    }
                    break;

                default:
                    break;
            }
        },
        imgClickEvent(item) {
            // window.open(item.tp);
        },
        copyClickEvent(item) {
            console.log(item.url)
            if (!item.url) {
                alert('未找到有效地址，请稍后重试！')
                return;
            }
            const urlObj = Qs.parse(item.url);
            urlObj.id = encodeURIComponent(urlObj.id);
            Object.keys(urlObj)
            let str = '';
            for (item of Object.keys(urlObj)) {
                str += `${item}=${urlObj[item]}&`;
            }
            const newUrl = str.slice(0, -1);

            const input = document.createElement('input');
            input.style.position = 'fixed';
            input.style.left = '-999px';
            input.style.top = '-999px';
            document.body.appendChild(input);
            input.setAttribute('value', newUrl);
            input.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                this.copyUrl = newUrl;
                this.popTitle = '温馨提示';
                this.popDesc = `阵型复制成功！您复制的阵型链接为：<span class="new-url">${newUrl}</span>`;
                // this.popDesc = `复制成功！您复制的链接为：<a href="clashofclans://action=OpenLayout&id=TH5%3AHV%3AAAAAPgAAAAAH8F1lrcBnCJTBblPVOMtO&platform=tencent">123</a>`;
                // this.popDesc = '阵型复制成功，请前往浏览器打开！';
                this.cancelText = '关闭';
                this.confirmText = '前往';
                this.showModel();
            }
            document.body.removeChild(input);
        },
        showModel() {
            this.popIf = true;
        },
        hideModel() {
            this.popIf = false;
            this.isInToPaintedEggshell = false;
        },
        confirmClick() {
            if (this.isInToPaintedEggshell) {
                window.open('/egg.html');
            } else {
                window.open(this.copyUrl);
            }
            this.hideModel();
        },
        inToPaintedEggshell() {
            this.popTitle = '隐藏彩蛋！';
            this.popDesc = '恭喜你发现了本网站的隐藏彩蛋，如果你也对世界充满好奇，那就让我们一期去探索吧！';
            this.cancelText = '退出';
            this.confirmText = '探索';
            this.isInToPaintedEggshell = true;
            this.showModel();
        },
    }
})