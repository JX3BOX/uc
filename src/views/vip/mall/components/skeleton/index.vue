<script>
import Calender from "./Calendar";
import Palu from "./Palu";
import Sidebar from "./Sidebar";
import Comment from "./Comment";
import AtCard from "./AtCard";
import HomeSkin from "./HomeSkin";
export default {
    name: "Skeleton",
    data() {
        return {
            component: {
                calendar: Calender,
                palu:Palu,
                sidebar:Sidebar,
                comment:Comment,
                atcard:AtCard,
                homebg:HomeSkin,
            },
        };
    },
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
    render(h) {
        if (this.component[this.category]) {
            return h(this.component[this.category], {
                props: {
                    img: this.img,
                },
            });
        }
        return null
    },
};
</script>
