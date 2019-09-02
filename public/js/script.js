Vue.component("image-modal", {
    template: "#image-modal-template",
    props: ["id", "showModal"],
    data: function() {
        return {
            image: {},
            form: { comment: "", username: "" },
            comments: []
        };
    },
    mounted: function() {
        // console.log("mounted is running with id: ", this.id);
        this.getInfo();
    },
    watch: {
        id: function() {
            this.getInfo();
        }
    },

    methods: {
        getInfo: function() {
            // console.log("myInfo is running");
            var me = this;
            axios
                .get("/imageinfo/" + me.id)
                .then(function(res) {
                    if (res.data) {
                        me.image = res.data;
                    } else {
                        throw new Error("no image found");
                    }
                })
                .then(
                    axios
                        .get("/comments/" + me.id)
                        .then(function(res) {
                            me.comments = res.data;
                        })
                        .catch(function(err) {
                            console.log("error when getting the comments", err);
                        })
                )
                .catch(function(err) {
                    console.log(
                        "error when getting image data on click: ",
                        err
                    );
                    me.closeModal();
                });
        },
        closeModal: function() {
            // console.log("close modal is running");
            this.$emit("close");
        },
        submitComment: function() {
            // e.preventDefault();
            var me = this;
            axios
                .post("/comments/" + me.id, me.form)
                .then(function(res) {
                    //add comment to end of comment array
                    me.comments.unshift(res.data);
                    //clear input fields
                    me.form.comment = "";
                    me.form.username = "";
                })
                .catch(function(err) {
                    console.log("error when adding comment: ", err);
                });
        }
    }
});

new Vue({
    el: "#main",
    data: {
        showModal: !!location.hash.slice(1),
        images: [],
        form: { title: "", description: "", username: "", file: null },
        id: location.hash.slice(1)
    },

    mounted: function() {
        console.log("normal vue with hash", this.id);
        var me = this;
        axios.get("/main").then(function(res) {
            me.images = res.data;
            setTimeout(me.infiniteScroll, 2000);
        });
        window.addEventListener("hashchange", function() {
            // console.log("event hashchange fired");
            var hashId = parseInt(location.hash.slice(1));
            if (typeof hashId === "number" && isNaN(hashId) === false) {
                me.id = location.hash.slice(1);
                me.showModal = true;
            } else {
                location.hash = "";
                history.pushState({}, "", "/");
            }
        });
    },
    methods: {
        closeModalOnParent: function() {
            this.id = null;
            location.hash = "";
            this.showModal = false;
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
        },

        // infinite scroll
        infiniteScroll: function() {
            var me = this;
            var lastId = this.images[this.images.length - 1].id;
            var hasReachedBottom =
                window.innerHeight + window.pageYOffset >=
                document.body.clientHeight - 200;

            if (hasReachedBottom) {
                console.log("hasReachedBottom");

                axios
                    .get("/main/" + lastId)
                    .then(function(res) {
                        me.images.push(...res.data);
                        lastId = me.images[me.images.length - 1].id;
                    })
                    .then(setTimeout(me.infiniteScroll, 500))
                    .catch(function(err) {
                        console.log("error at axos on infinity scroll", err);
                    });
            } else {
                console.log("not at the bottom yet");
                setTimeout(me.infiniteScroll, 500);
            }
        }

        // end infinite scroll
    }
});
