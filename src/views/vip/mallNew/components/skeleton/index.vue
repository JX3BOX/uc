<script>
import { h, markRaw } from "vue";
import Calender from "./Calendar";
import Palu from "./Palu";
import Sidebar from "./Sidebar";
import Comment from "./Comment";
import AtCard from "./AtCard";
import HomeSkin from "./HomeSkin";

const componentMap = {
    calendar: markRaw(Calender),
    palu: markRaw(Palu),
    sidebar: markRaw(Sidebar),
    comment: markRaw(Comment),
    atcard: markRaw(AtCard),
    homebg: markRaw(HomeSkin),
};

export default {
    name: "Skeleton",
    props: {
        img: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            default: "",
        },
    },
    render() {
        if (componentMap[this.category]) {
            return h(componentMap[this.category], {
                img: this.img,
            });
        }
        return null;
    },
};
</script>
