console.log("insanity check");

new Vue({
    el: "#main",
    data: {
        name: "Sassafras", // these properties are reactive
        seen: true,
        cities: []
    },
    mounted: function() {
        console.log("my vue has mounted");
        console.log("Cities is ", this.cities);
        var me = this;
        axios.get("/cities").then(function(response) {
            console.log("this.cities in then", this.cities);
            console.log("me.cities in then", me.cities);
            console.log("This is my response", response.data);
            me.cities = response.data;
        });
    },
    methods: {
        myFunction: function(cityName) {
            console.log("my new function is running in city ", cityName);
        }
    }
});
