Vue.component("image-modal", {
    template: "#image-modal-template",
    props: ["id", "showModal"],
    data: function() {
        return {
            image: {},
            form: { comment: "", username: "" }
        };
    },
    mounted: function() {
        console.log("mounted is running with id: ", this.id);
        this.getInfo();
    },
    methods: {
        getInfo: function() {
            console.log("myInfo is running");
            var me = this;
            axios
                .get("/imageinfo/" + me.id)
                .then(function(res) {
                    me.image = res.data;
                    console.log(res.data);
                })
                .catch(function(err) {
                    console.log(
                        "error when getting image data on click: ",
                        err
                    );
                });
        },
        closeModal: function() {
            // console.log("close modal is running");
            this.$emit("close");
        },
        handleClick: function(e) {
            e.preventDefault();
            var me = this;
            axios
                .post("/comment", {
                    comment: me.form.comment,
                    username: me.form.username,
                    imageId: me.image.id
                })
                .then(function(res) {
                    //add so comment aray or object
                });
        }
    }
});

new Vue({
    el: "#main",
    data: {
        showModal: false,
        images: [],
        form: { title: "", description: "", username: "", file: null },
        id: "",
        comments: []
    },

    mounted: function() {
        // console.log("my vue has mounted");
        var me = this;
        axios.get("/main").then(function(response) {
            me.images = response.data;
        });
    },
    methods: {
        closeModalOnParent: function() {
            console.log("closeModalOnParent running");
            this.showModal = false;
        },

        showModalMethod: function(id) {
            console.log("this is my image id", id);
            this.showModal = true;
            this.id = id;
        },

        handleClick: function(e) {
            e.preventDefault();
            // console.log("this: ", this);
            var formData = new FormData();
            formData.append("title", this.form.title);
            formData.append("description", this.form.description);
            formData.append("username", this.form.username);
            formData.append("file", this.form.file);
            var me = this;
            axios
                .post("/upload", formData)
                .then(function(res) {
                    var img = res.data; // has title, id and url
                    me.images.unshift(img);
                    //clear input fields
                    me.form.title = "";
                    me.form.description = "";
                    me.form.username = "";
                    document.getElementById("fileinput").value = ""; //clear file input field
                })
                .catch(function(err) {
                    console.log("err in post: ", err);
                });
        },
        handleChange: function(e) {
            this.form.file = e.target.files[0];
        }
    }
});
