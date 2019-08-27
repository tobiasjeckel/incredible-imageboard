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
            var me = this;
            axios
                .post("/upload", formData)
                .then(function(res) {
                    var img = res.data; // has title and url
                    me.images.unshift(img);
                    me.title = "";
                    me.username = "";
                    me.description = "";
                    document.getElementById("fileinput").value = "";
                })
                .catch(function(err) {
                    console.log("err in post: ", err);
                });
        },
        handleChange: function(e) {
            this.file = e.target.files[0];
        }
    }
});
