import User from "@jx3box/jx3box-common/js/user";
import { __Domain } from "@/utils/config";

export default function() {
    if (location.hostname == "www.jx3box.com" || location.hostname == "origin.jx3box.com") {
        if (!User.isLogin()) {
            User.destroy();
            User.toLogin();
        }
    }
}
