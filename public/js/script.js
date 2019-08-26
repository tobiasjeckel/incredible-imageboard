console.log("insanity check");

new Vue({
    el: "#main",
    data: {
        images: []
    },
    mounted: function() {
        console.log("my vue has mounted");
        var me = this;
        axios.get("/main").then(function(response) {
            me.images = response.data;
            console.log("me.images in then", me.images);
            console.log("This is my response", response.data);
        });
    }
});
