var app = new Vue({
    el: '#app',
    data() {
        return {
            pickerIf: false,
            menuList: [],
            intactMenuList: [],
            itemList: [],
            gestureFeatures: [],
        }
    },
    computed: {
        isWx() {
            return navigator.userAgent.match(/micromessenger/i);
        }
    },
    created() {
        axios.get('http://rqkoe7kar.hd-bkt.clouddn.com/source-config.json')
            .then(res => {
                try {
                    const data = JSON.parse(JSON.stringify(res.data));
                    this.intactMenuList = data.menuList;
                    const incompleteList = data.menuList.filter(el => {
                        return el.id !== 2;
                    });
                    this.menuList = incompleteList;
                } catch (error) {
                    console.log(error);
                }
            })
            .catch(err => err);
    },
    mounted() {
        this.onGesture();
    },
    methods: {
        menuClick(item) {
            console.log(item)
            this.itemList = item.itemList;
            this.showPicker();
        },
        menuItemClick(link) {
            window.open(link);
        },
        showPicker() {
            this.pickerIf = true;
        },
        hidePicker() {
            this.itemList = [];
            this.pickerIf = false;
        },
        inToEgg() {
            this.menuList = this.intactMenuList;
        },
        onGesture() {
            const that = this;
            let startX = 0;
            let startY = 0;
            document.addEventListener('touchstart', function (e) {
                startX = e.changedTouches[0].pageX;
                startY = e.changedTouches[0].pageY;
            });
            document.addEventListener('touchmove', function (e) {
                try {
                    const moveEndX = e.changedTouches[0].pageX;
                    const moveEndY = e.changedTouches[0].pageY;
                    const X = moveEndX - startX;
                    const Y = moveEndY - startY;
                    if (Math.abs(X) > Math.abs(Y) && X > 0) {
                        startX = e.changedTouches[0].pageX;
                        startY = e.changedTouches[0].pageY;
                        if (that.gestureFeatures[that.gestureFeatures.length - 1] !== 1) {
                            that.gestureFeatures.push(1);
                        }
                    }
                    if (Math.abs(X) > Math.abs(Y) && X < 0) {
                        startX = e.changedTouches[0].pageX;
                        startY = e.changedTouches[0].pageY;
                        if (that.gestureFeatures[that.gestureFeatures.length - 1] !== 2) {
                            that.gestureFeatures.push(2);
                        }
                    }
                    if (that.gestureFeatures.length > 10) {
                        that.gestureFeatures = [];
                        that.inToEgg();
                    }
                } catch (err) {
                    console.log(err);
                }
            });
            document.addEventListener('touchend', function (e) {
                that.gestureFeatures = [];
            });
        }
    }
})