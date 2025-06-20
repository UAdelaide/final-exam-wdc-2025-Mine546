const vuea = new Vue({
    el: '#app',
    data: {
        choose: 'Choose ...',
        special: SPECIALS[0],
        show_ad: true,
        top_menu: MENU,
        top_menu_item: null,
        top_menu_hover: false
    },
    methods: {
        changeChoose(newChoose) {
            this.choose = newChoose;
        },
        setTopMenuItem(index) {
            this.top_menu_item = index;
        },
        setTopMenuHover(state) {
            this.top_menu_hover = state;
        }
    }
});