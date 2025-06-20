const app = Vue.createApp({

    data(){
        return{
            count: 10,
            dog:''
        };
    },
    methods: {
        async fetchDogImage() {
            try {
                const res = await fetch('https://dog.ceo/api/breeds/image/random');
                const data = await res.json();
                this.dogImage = data.message;
            } catch (error) {
                console.error('whoops', error);
            }
        }
    },
    watch: {
        count(holdCount){
            if (holdCount === 0) {
                this.fetchDogImage();
            }
        }
    }
});

app.mount('#app');
