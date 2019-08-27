console.log("insanity check");

new Vue({
    el: "#main",
    data: {
        images: [],
        title: "",
        description: "",
        username: "",
        file: null
    },
    mounted: function() {
        console.log("my vue has mounted");
        var me = this;
        axios.get("/main").then(function(response) {
            me.images = response.data;
            console.log("me.images in then", me.images);
            console.log("This is my response", response.data);
        });
    },
    methods: {
        handleClick: function(e) {
            e.preventDefault();
            // console.log("this: ", this);

            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("file", this.file);

            axios
                .post("/upload", formData)
                .then(function(res) {
                    console.log("response from post /upload: ", res);
                })
                .catch(function(err) {
                    console.log("err in post: ", err);
                });
        },
        handleChange: function(e) {
            // console.log("handleChange is running");
            // console.log("file: ", e.target.files[0]);

            this.file = e.target.files[0];
        }
    }
});
