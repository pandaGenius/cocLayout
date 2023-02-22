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

            loadingIf: false
        }
    },
    created() {
        this.getFilter();
        this.init();
    },
    methods: {
        getData({ name='',act='zhen', lxid=this.levelIndex, fu=this.originIndex, px=this.sortIndex, page=this.page,  } = {}) {
            return new Promise((resolve, reject) => {
                // const ip_address = 'http://r9qw9s.natappfree.cc';
                // const ip_address = 'http://localhost:8080';
                axios.get(`/hycoc.aspx?act=${act}&lxid=${lxid}&px=${px}&name=${name}&page=${page}&fu=${fu}`)
                    .then(res => resolve(res.data)).catch(err => reject(err));
            });
            
        },
        getFilter() {
            this.getData({act: 'lx'}).then(res => {
                this.filter.push(
                    { name: '基地：', type: 1, level: [{lxname:'不限', lxid: ''}].concat(res) }, 
                    { name: '区服：', type: 2, level: [{lxname:'不限', lxid: ''}, {lxname:'国服', lxid: 1}, {lxname:'国际服', lxid: 2}]},
                    { name: '排序：', type: 3, level: [{lxname:'最新', lxid: '' }, {lxname:'热门', lxid: 2}]},
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
                    this.init({lxid: this.levelIndex, page: this.page});
                    break;
                case 2:
                    console.log(this.originIndex)
                    if (this.originIndex === it.lxid) return;
                    this.originIndex = it.lxid;
                    this.page = 1;
                    this.init({fu: this.originIndex, page: this.page});
                    break;
                case 3:
                    // if (this.sortIndex === it.lxid) return;
                    this.sortIndex = it.lxid;
                    this.page = 1;
                    this.init({px: this.sortIndex, page: this.page});
                    break;
                default:
                    break;
            }
        },
        searchClickEvent() {
            this.init({name: this.searchWord})
        },
        resetEvent() {
            this.levelIndex =  '';
            this.originIndex =  '';
            this.sortIndex =  '';
            this.searchWord =  '';

            this.page =  1;
            this.pagesum = 0;
            this.pageNumber = '';
            this.init();
        },
        chagePage(type) {
            switch (type) {
                case 1:
                    if (this.page === 1) return;
                    this.page -= 1;
                    this.init({ page: this.page });
                    break;
                case 2:
                    if (this.page === this.pagesum) return;
                    this.page += 1;
                    this.init({ page: this.page });
                    break;
                case 3:
                    if (this.pageNumber > 0 && this.pageNumber < this.pagesum) {
                        this.pageNumber = parseFloat(this.pageNumber);
                        this.page = this.pageNumber;
                        this.init({ page: this.page });
                    } else {
                        alert('你输入的页码超出范围，请重新输入！');
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
            for(item of Object.keys(urlObj)) {
                str += `${item}=${urlObj[item]}&`;
            }
            const newUrl = str.slice(0, -1);

            const input = document.createElement('input');
            document.body.appendChild(input);
            input.setAttribute('value', newUrl);
            input.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                alert('阵型复制成功，请前往浏览器打开！')
                // alert(`复制成功！您复制的链接为：${newUrl}`);
            }
            document.body.removeChild(input);
        }
    }
})