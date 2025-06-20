const vueinst = new Vue({
    data: {
        remaining: '10'
    },
    methods: {
        changeRemaining(newRemaining){
            this.remaining=remaining-1;
        },
    }
});
